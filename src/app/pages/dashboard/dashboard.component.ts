import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { DashboardKPIs, Pago, StatCard, Activity } from '../../models/interfaces';
import { PagoModalComponent } from '../../components/modals/pago-modal/pago-modal.component';
import { DashboardService } from '../../services/dashboard.service';
import { PagosService } from '../../services/pagos.service';
import { StatCardComponent } from '../../components/shared/stat-card/stat-card.component';
import { RecentActivityComponent } from '../../components/shared/recent-activity/recent-activity.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PagoModalComponent, StatCardComponent, RecentActivityComponent, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  i18n = inject(I18nService);
  private dashboardService = inject(DashboardService);
  private pagosService = inject(PagosService);

  // Modal handling
  isModalOpen = false;
  selectedPago?: Pago;
  loading = true;

  // Data for UI
  stats: StatCard[] = [];
  activities: Activity[] = [];

  pagos: Pago[] = [];
  totalsByCurrency: Array<{ currency: string; total: number; count: number }> = [];
  paymentMethods: Array<{ id: 'TARJETA' | 'CUENTA_BANCARIA'; label: string; total: number; percent: number }> = [];
  topSuppliers: Array<{ name: string; count: number; total: number; currency: string }> = [];

  ngOnInit(): void {
    this.reloadDashboard();
  }

  reloadDashboard(): void {
    this.loading = true;
    
    forkJoin({
      kpis: this.dashboardService.getKPIs().pipe(
        catchError(() => of(undefined))
      ),
      pagos: this.pagosService.getPagos({ limit: 10 })
        .pipe(catchError(() => of([] as Pago[])))
    }).subscribe({
      next: (res) => {
        this.pagos = res.pagos;

        const computedKpis = res.kpis ?? this.computeKpisFromPagos(res.pagos);
        this.mapStats(computedKpis);
        this.mapActivities(res.pagos);

        this.computeTotalsByCurrency(res.pagos);
        this.computePaymentMethods(res.pagos, computedKpis);
        this.computeTopSuppliers(res.pagos);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.pagos = [];
        const computedKpis = this.computeKpisFromPagos([]);
        this.mapStats(computedKpis);
        this.mapActivities([]);
        this.computeTotalsByCurrency([]);
        this.computePaymentMethods([], computedKpis);
        this.computeTopSuppliers([]);
        this.loading = false;
      }
    });
  }

  private mapStats(kpis: DashboardKPIs): void {
    this.stats = [
      {
        id: 'pagos-pendientes',
        title: 'Pagos Pendientes',
        value: kpis.pagosPendientes,
        icon: 'pi pi-clock',
        color: '#ff9800',
        unit: ''
      },
      {
        id: 'pagos-estado-pagado',
        title: 'Pagos Completados',
        value: kpis.pagosPagados,
        icon: 'pi pi-check-circle',
        color: '#4caf50',
        unit: ''
      },
      {
        id: 'pagos-verificados',
        title: 'Verificados',
        value: kpis.pagosVerificados,
        icon: 'pi pi-verified',
        color: '#2196f3',
        unit: ''
      },
      {
        id: 'emails-espera-envio',
        title: 'Correos Pendientes',
        value: kpis.correosPendientes,
        icon: 'pi pi-envelope',
        color: '#9c27b0',
        unit: ''
      }
    ];
  }

  private mapActivities(pagos: Pago[]): void {
    this.activities = pagos.map(p => ({
      id: p.id.toString(),
      date: this.formatDate(p.fechaCreacion),
      time: new Date(p.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: p.proveedor?.nombre || 'Proveedor',
      client: p.clientes?.[0]?.cliente?.nombre,
      action: 'Pago registrado',
      amount: p.monto,
      currency: p.moneda,
      paymentStatus: p.pagado ? 'PAGADO' : 'POR_PAGAR',
      verified: p.verificado,
      status: p.verificado ? 'completado' : 'sin-verificacion'
    }));
  }

  private computeKpisFromPagos(pagos: Pago[]): DashboardKPIs {
    const pagosPendientes = pagos.filter(p => !p.pagado).length;
    const pagosPagados = pagos.filter(p => !!p.pagado).length;
    const pagosVerificados = pagos.filter(p => !!p.verificado).length;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const pagosMes = pagos.filter(p => {
      const d = new Date(p.fechaCreacion);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const montoTotalMes = pagosMes.reduce((acc, p) => acc + (p.monto || 0), 0);
    const montoTarjetas = pagosMes
      .filter(p => p.tipoMedioPago === 'TARJETA')
      .reduce((acc, p) => acc + (p.monto || 0), 0);
    const montoCuentas = pagosMes
      .filter(p => p.tipoMedioPago === 'CUENTA_BANCARIA')
      .reduce((acc, p) => acc + (p.monto || 0), 0);

    return {
      pagosPendientes,
      pagosPagados,
      pagosVerificados,
      correosPendientes: 0,
      correosEnviados: 0,
      montoTotalMes,
      montoTarjetas,
      montoCuentas
    };
  }

  private computeTotalsByCurrency(pagos: Pago[]): void {
    const map = new Map<string, { total: number; count: number }>();
    for (const p of pagos) {
      const c = p.moneda || 'N/A';
      const prev = map.get(c) ?? { total: 0, count: 0 };
      map.set(c, { total: prev.total + (p.monto || 0), count: prev.count + 1 });
    }
    this.totalsByCurrency = Array.from(map.entries())
      .map(([currency, v]) => ({ currency, total: v.total, count: v.count }))
      .sort((a, b) => b.total - a.total);
  }

  private computePaymentMethods(pagos: Pago[], kpis: DashboardKPIs): void {
    const total = Math.max(0, (kpis.montoTarjetas || 0) + (kpis.montoCuentas || 0));
    const percent = (value: number) => {
      if (!total) return 0;
      return Math.round((value / total) * 100);
    };

    const labelCard = this.i18n.language() === 'fr' ? 'Cartes' : 'Tarjetas';
    const labelAccount = this.i18n.language() === 'fr' ? 'Comptes' : 'Cuentas';

    this.paymentMethods = [
      { id: 'TARJETA', label: labelCard, total: kpis.montoTarjetas || 0, percent: percent(kpis.montoTarjetas || 0) },
      { id: 'CUENTA_BANCARIA', label: labelAccount, total: kpis.montoCuentas || 0, percent: percent(kpis.montoCuentas || 0) }
    ];
  }

  private computeTopSuppliers(pagos: Pago[]): void {
    const map = new Map<string, { name: string; count: number; total: number; currency: string }>();
    for (const p of pagos) {
      const name = p.proveedor?.nombre || 'Proveedor';
      const key = `${name}__${p.moneda || 'N/A'}`;
      const prev = map.get(key) ?? { name, count: 0, total: 0, currency: p.moneda || 'N/A' };
      map.set(key, {
        ...prev,
        count: prev.count + 1,
        total: prev.total + (p.monto || 0)
      });
    }
    this.topSuppliers = Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }

  openCreateModal(): void {
    this.selectedPago = undefined;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPago = undefined;
  }

  onPagoSaved(pago: Pago): void {
    this.reloadDashboard();
    this.closeModal();
  }

  getCurrentDate(): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', options);
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES');
  }
}
