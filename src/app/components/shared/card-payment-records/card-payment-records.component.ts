import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { PagosService } from '../../../services/pagos.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { PaginatedTableComponent, TableColumn, RowAction, ActionEvent } from '../paginated-table/paginated-table.component';
import { DatePickerModule } from 'primeng/datepicker';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { I18nService } from '../../../services/i18n.service';
import { Pago } from '../../../models/interfaces';

@Component({
  selector: 'app-card-payment-records',
  standalone: true,
  imports: [CommonModule, TranslatePipe, PaginatedTableComponent, DatePickerModule],
  templateUrl: './card-payment-records.component.html',
  styleUrl: './card-payment-records.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardPaymentRecordsComponent implements OnInit, OnDestroy {
  pagos: Pago[] = [];
  isLoading = false;
  errorMessage = '';

  // Filtros
  dateFilter: string = '';
  statusFilter: 'todos' | 'A PAGAR' | 'PAGADO' = 'todos';
  verificationFilter: 'todos' | 'verificados' | 'no-verificados' = 'todos';
  filteredPagos: Pago[] = [];
  searchTerm: string = '';
  filterTab: 'todos' | 'pendientes' | 'pagados' = 'todos';

  // Confirmación de eliminación (solo admin)
  showConfirmDelete = false;
  pagoToDelete: Pago | null = null;

  private i18nService = inject(I18nService);

  // Configuración de tabla genérica
  columns: TableColumn[] = [
    {
      key: 'createdAt',
      label: 'fecha',
      translationKey: 'fecha',
      type: 'date',
      width: '100px'
    },
    {
      key: 'cliente.nombre',
      label: 'cliente',
      translationKey: 'cliente',
      type: 'text',
      width: '150px',
      formatter: (value: any, row: any) => (row.cliente as any)?.nombre || 'N/A'
    },
    {
      key: 'proveedor.nombre',
      label: 'proveedor',
      translationKey: 'proveedor',
      type: 'text',
      width: '150px',
      formatter: (value: any, row: any) => (row.proveedor as any)?.nombre || 'N/A'
    },
    {
      key: 'monto',
      label: 'monto',
      translationKey: 'monto',
      type: 'currency',
      width: '100px'
    },
    {
      key: 'numero_presta',
      label: 'numeroPresta',
      translationKey: 'numeroPresta',
      type: 'text',
      width: '120px'
    },
    {
      key: 'tarjeta.numero_tarjeta',
      label: 'tarjeta',
      translationKey: 'tarjeta',
      type: 'text',
      width: '130px',
      formatter: (value: any, row: any) => {
        const num = (row.tarjeta as any)?.numero_tarjeta;
        return num ? `****${num.slice(-4)}` : 'N/A';
      }
    },
    {
      key: 'estado.nombre',
      label: 'estado',
      translationKey: 'estado',
      type: 'badge',
      width: '100px',
      formatter: (value: any, row: any) => (row.estado as any)?.nombre || 'N/A',
      badgeClass: (value: any) => this.getStatusClass(value)
    },
    {
      key: 'esta_verificado',
      label: 'verificacion',
      translationKey: 'verificacion',
      type: 'badge',
      width: '100px',
      formatter: (value: any) => (value ? this.t('si') : this.t('no')),
      badgeClass: (value: any) => this.getVerificationClass(value)
    },
    {
      key: 'registrado_por.username',
      label: 'registradoPor',
      translationKey: 'registradoPor',
      type: 'text',
      width: '150px',
      formatter: (value: any, row: any) => (row.usuario as any)?.username || 'N/A'
    }
  ];

  actions: RowAction[] = [
    {
      id: 'view',
      label: 'ver',
      translationKey: 'ver',
      icon: 'pi pi-eye',
      class: 'view-btn'
    },
    {
      id: 'edit',
      label: 'editar',
      translationKey: 'editar',
      icon: 'pi pi-pencil',
      class: 'edit-btn'
    },
    {
      id: 'delete',
      label: 'eliminar',
      translationKey: 'eliminar',
      icon: 'pi pi-trash',
      class: 'delete-btn'
    }
  ];

  private destroy$ = new Subject<void>();

  @Output() onEdit = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();

  private pagosService = inject(PagosService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}


  ngOnInit(): void {
    this.isLoading = true;
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.pagosService.getPagos()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (pagos: Pago[]) => {
          this.pagos = pagos;
          this.applyFilters();
        },
        error: (err: any) => {
          console.error('Error cargando pagos', err);
          this.errorMessage = 'Error al cargar los pagos';
        }
      });
  }

  /**
   * Maneja eventos de acciones de la tabla genérica
   */
  onTableAction(event: ActionEvent): void {
    switch (event.action) {
      case 'view':
        this.onViewPago(event.row);
        break;
      case 'edit':
        this.onEditPago(event.row);
        break;
      case 'delete':
        this.openDeleteModal(event.row);
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onViewPago(pago: any): void {
    this.onView.emit(pago);
  }

  onEditPago(pago: any): void {
    this.onEdit.emit(pago);
  }

  openDeleteModal(pago: any): void {
    this.pagoToDelete = pago;
    this.showConfirmDelete = true;
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    if (!this.pagoToDelete) return;
    const id = this.pagoToDelete.id || 0;
    this.pagosService.cancelarPago(id).subscribe({
      next: () => {
        // this.notificationService.success('✅ Pago eliminado exitosamente');
        this.showConfirmDelete = false;
        this.pagoToDelete = null;
        this.cargarPagos();
      },
      error: (error: any) => {
        console.error('Error eliminando pago:', error);
        // this.notificationService.error(`❌ Error al eliminar pago`);
      }
    });
  }

  cancelDelete(): void {
    this.showConfirmDelete = false;
    this.pagoToDelete = null;
  }

  // Aplicar filtros
  applyFilters(): void {
    let data = [...this.pagos];

    if (this.dateFilter) {
      data = data.filter(r => ((r as any).createdAt || '').startsWith(this.dateFilter));
    }

    if (this.statusFilter !== 'todos') {
      data = data.filter(r => (r as any).estado?.nombre === this.statusFilter);
    }

    // Filtro por búsqueda libre
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter((r: any) =>
        ((r.createdAt || '') as string).toLowerCase().includes(term) ||
        ((r.cliente?.nombre || '') as string).toLowerCase().includes(term) ||
        ((r.proveedor?.nombre || '') as string).toLowerCase().includes(term) ||
        ((r.numero_presta || '') as string).toLowerCase().includes(term) ||
        ((r.usuario?.username || '') as string).toLowerCase().includes(term)
      );
    }

    // Filtro por pestaña (todos, pendientes, pagados)
    if (this.filterTab === 'pendientes') {
      data = data.filter(r => (r as any).estado?.nombre === 'A PAGAR');
    } else if (this.filterTab === 'pagados') {
      data = data.filter(r => (r as any).estado?.nombre === 'PAGADO');
    }

    this.filteredPagos = data;
    this.cdr.markForCheck();
  }

  onSearchChange(value: string): void {
    this.searchTerm = (value || '').toLowerCase();
    this.applyFilters();
  }

  setFilterTab(tab: 'todos' | 'pendientes' | 'pagados'): void {
    this.filterTab = tab;
    // Adaptar statusFilter según tab si es necesario
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PAGADO':
        return 'status-aprobado';
      case 'A PAGAR':
        return 'status-pendiente';
      default:
        return 'status-pendiente';
    }
  }

  getVerificationClass(verified: boolean): string {
    return verified ? 'verified' : 'not-verified';
  }

  private t(key: string): string {
    return (this.i18nService as any).t ? (this.i18nService as any).t(key) : key;
  }
}
