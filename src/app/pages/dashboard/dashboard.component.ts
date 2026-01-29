import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { DashboardKPIs, TopProveedor, Pago, Proveedor, Servicio } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('dashboard.title') }}</h1>
          <p class="header-subtitle">{{ getCurrentDate() }}</p>
        </div>
        <button class="btn btn-primary">
          <span>➕</span>
          {{ i18n.t('payments.new') }}
        </button>
      </div>

      <!-- KPIs Grid -->
      <div class="grid grid-4 mb-3">
        <div class="stat-card">
          <div class="stat-icon" style="background: #fff3cd;">🕐</div>
          <div class="stat-value">{{ kpis.pagosPendientes }}</div>
          <div class="stat-title">{{ i18n.t('dashboard.pending_payments') }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: #d4edda;">✅</div>
          <div class="stat-value">{{ kpis.pagosPagados }}</div>
          <div class="stat-title">{{ i18n.t('dashboard.paid') }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: #cce5ff;">🔒</div>
          <div class="stat-value">{{ kpis.pagosVerificados }}</div>
          <div class="stat-title">{{ i18n.t('dashboard.verified') }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: #f8d7da;">✉️</div>
          <div class="stat-value">{{ kpis.correosPendientes }}</div>
          <div class="stat-title">{{ i18n.t('dashboard.pending_emails') }}</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-2 mb-3">
        <!-- Payment Methods Card -->
        <div class="card">
          <div class="card-header">
            <h3>{{ i18n.t('dashboard.payment_methods') }}</h3>
          </div>
          <div class="chart-placeholder">
            <div class="payment-methods-chart">
              <div class="method-bar">
                <div class="method-label">💳 {{ i18n.language() === 'fr' ? 'Cartes' : 'Tarjetas' }}</div>
                <div class="method-progress">
                  <div class="progress-fill cards" [style.width.%]="getCardPercentage()"></div>
                </div>
                <div class="method-value">{{ formatCurrency(kpis.montoTarjetas) }}</div>
              </div>
              <div class="method-bar">
                <div class="method-label">🏦 {{ i18n.language() === 'fr' ? 'Comptes' : 'Cuentas' }}</div>
                <div class="method-progress">
                  <div class="progress-fill accounts" [style.width.%]="getAccountPercentage()"></div>
                </div>
                <div class="method-value">{{ formatCurrency(kpis.montoCuentas) }}</div>
              </div>
            </div>
            <div class="total-section">
              <span class="total-label">{{ i18n.t('dashboard.monthly_total') }}</span>
              <span class="total-value">{{ formatCurrency(kpis.montoTotalMes) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Top Suppliers Card -->
        <div class="card">
          <div class="card-header">
            <h3>{{ i18n.t('dashboard.top_suppliers') }}</h3>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>{{ i18n.t('suppliers.name') }}</th>
                  <th>{{ i18n.t('suppliers.service') }}</th>
                  <th class="text-right">{{ i18n.t('payments.amount') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (item of topProveedores; track item.proveedor.id) {
                  <tr>
                    <td>{{ item.proveedor.nombre }}</td>
                    <td>
                      <span class="badge badge-paid">{{ item.proveedor.servicio?.nombre }}</span>
                    </td>
                    <td class="text-right">
                      <strong>{{ formatCurrency(item.montoTotal) }}</strong>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h3>{{ i18n.t('dashboard.recent_activity') }}</h3>
          <button class="btn btn-secondary btn-sm">
            {{ i18n.t('actions.refresh') }}
          </button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('payments.code') }}</th>
                <th>{{ i18n.t('payments.supplier') }}</th>
                <th>{{ i18n.t('payments.amount') }}</th>
                <th>{{ i18n.t('payments.method') }}</th>
                <th>{{ i18n.t('payments.status') }}</th>
                <th>{{ i18n.t('payments.date') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (pago of recentPagos; track pago.id) {
                <tr>
                  <td><strong>{{ pago.codigoReserva }}</strong></td>
                  <td>{{ pago.proveedor?.nombre }}</td>
                  <td>{{ formatCurrency(pago.monto, pago.moneda) }}</td>
                  <td>
                    <span class="method-icon">
                      {{ pago.tipoMedioPago === 'TARJETA' ? '💳' : '🏦' }}
                    </span>
                  </td>
                  <td>
                    @if (pago.verificado) {
                      <span class="badge badge-verified">{{ i18n.t('status.verified') }}</span>
                    } @else if (pago.pagado) {
                      <span class="badge badge-paid">{{ i18n.t('status.paid') }}</span>
                    } @else {
                      <span class="badge badge-pending">{{ i18n.t('status.pending') }}</span>
                    }
                  </td>
                  <td class="text-muted">{{ formatDate(pago.fechaCreacion) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .chart-placeholder {
      padding: var(--spacing-md);
    }

    .payment-methods-chart {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .method-bar {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .method-label {
      width: 100px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .method-progress {
      flex: 1;
      height: 24px;
      background: var(--bg-hover);
      border-radius: var(--border-radius);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: var(--border-radius);
      transition: width var(--transition-normal);

      &.cards {
        background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
      }

      &.accounts {
        background: linear-gradient(90deg, #6b7280, #9ca3af);
      }
    }

    .method-value {
      width: 120px;
      text-align: right;
      font-weight: 600;
      color: var(--text-primary);
    }

    .total-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }

    .total-label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .total-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-color);
    }

    .method-icon {
      font-size: 18px;
    }
  `]
})
export class DashboardComponent {
  i18n = inject(I18nService);

  // Datos de ejemplo para demostración
  kpis: DashboardKPIs = {
    pagosPendientes: 23,
    pagosPagados: 156,
    pagosVerificados: 142,
    correosPendientes: 8,
    correosEnviados: 148,
    montoTotalMes: 245780.50,
    montoTarjetas: 187450.00,
    montoCuentas: 58330.50
  };

  topProveedores: TopProveedor[] = [
    { 
      proveedor: { id: 1, nombre: 'Voyage Excellence', servicioId: 1, servicio: { id: 1, nombre: 'Hotels', activo: true, fechaCreacion: new Date() }, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      cantidadPagos: 45,
      montoTotal: 67500.00
    },
    { 
      proveedor: { id: 2, nombre: 'Canada Tours', servicioId: 2, servicio: { id: 2, nombre: 'Excursion', activo: true, fechaCreacion: new Date() }, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      cantidadPagos: 32,
      montoTotal: 48200.00
    },
    { 
      proveedor: { id: 3, nombre: 'Assurance Plus', servicioId: 3, servicio: { id: 3, nombre: 'Assurance', activo: true, fechaCreacion: new Date() }, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      cantidadPagos: 28,
      montoTotal: 35800.00
    },
    { 
      proveedor: { id: 4, nombre: 'Location Auto QC', servicioId: 4, servicio: { id: 4, nombre: 'Car rental', activo: true, fechaCreacion: new Date() }, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      cantidadPagos: 24,
      montoTotal: 29400.00
    }
  ];

  recentPagos: Pago[] = [
    { id: 1, proveedorId: 1, proveedor: { id: 1, nombre: 'Voyage Excellence', servicioId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-001', monto: 2500.00, moneda: 'CAD', tipoMedioPago: 'TARJETA', pagado: true, verificado: true, gmailEnviado: true, activo: true, fechaCreacion: new Date() , fechaActualizacion: new Date() },
    { id: 2, proveedorId: 2, proveedor: { id: 2, nombre: 'Canada Tours', servicioId: 2, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-002', monto: 1800.00, moneda: 'USD', tipoMedioPago: 'CUENTA_BANCARIA', pagado: true, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 3, proveedorId: 3, proveedor: { id: 3, nombre: 'Assurance Plus', servicioId: 3, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-003', monto: 950.00, moneda: 'CAD', tipoMedioPago: 'TARJETA', pagado: false, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date()  },
    { id: 4, proveedorId: 1, proveedor: { id: 1, nombre: 'Voyage Excellence', servicioId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-004', monto: 3200.00, moneda: 'USD', tipoMedioPago: 'TARJETA', pagado: true, verificado: true, gmailEnviado: true, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date()  },
    { id: 5, proveedorId: 4, proveedor: { id: 4, nombre: 'Location Auto QC', servicioId: 4, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-005', monto: 780.00, moneda: 'CAD', tipoMedioPago: 'CUENTA_BANCARIA', pagado: true, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }
  ];

  getCurrentDate(): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', options);
  }

  formatCurrency(amount: number, currency: string = 'CAD'): string {
    return new Intl.NumberFormat(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES');
  }

  getCardPercentage(): number {
    const total = this.kpis.montoTarjetas + this.kpis.montoCuentas;
    return total > 0 ? (this.kpis.montoTarjetas / total) * 100 : 0;
  }

  getAccountPercentage(): number {
    const total = this.kpis.montoTarjetas + this.kpis.montoCuentas;
    return total > 0 ? (this.kpis.montoCuentas / total) * 100 : 0;
  }
}
