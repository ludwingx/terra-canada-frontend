import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';
import { Pago } from '../../models/interfaces';
import { PagoModalComponent } from '../../components/modals/pago-modal/pago-modal.component';
import { PagosService } from '../../services/pagos.service';

@Component({
  selector: 'app-pagos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PagoModalComponent],
  template: `
    <div class="pagos-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('payments.title') }}</h1>
          <p class="header-subtitle">{{ pagos().length }} {{ i18n.t('payments.count') }}</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span>➕</span>
          {{ i18n.t('payments.new') }}
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-3">
        <div class="filters-row">
          <div class="filter-group">
            <input 
              type="text" 
              class="form-control" 
              [placeholder]="i18n.t('actions.search') + '...'"
              [(ngModel)]="searchQuery"
            >
          </div>
          <div class="filter-group">
            <select class="form-control" [(ngModel)]="filterStatus">
              <option value="">{{ i18n.t('filter.all_status') }}</option>
              <option value="pending">{{ i18n.t('status.pending') }}</option>
              <option value="paid">{{ i18n.t('status.paid') }}</option>
              <option value="verified">{{ i18n.t('status.verified') }}</option>
            </select>
          </div>
          <div class="filter-group">
            <select class="form-control" [(ngModel)]="filterMethod">
              <option value="">{{ i18n.t('filter.all_methods') }}</option>
              <option value="TARJETA">{{ i18n.t('filter.cards') }}</option>
              <option value="CUENTA_BANCARIA">{{ i18n.t('filter.accounts') }}</option>
            </select>
          </div>
          <button class="btn btn-secondary" (click)="loadPagos()">
            {{ i18n.t('actions.refresh') }}
          </button>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="card">
        @if (loading()) {
          <div class="loading-overlay">
            <div class="spinner"></div>
            <p>{{ i18n.t('msg.loading') }}</p>
          </div>
        }

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('payments.code') }}</th>
                <th>{{ i18n.t('payments.supplier') }}</th>
                <th>{{ i18n.t('payments.client') }}</th>
                <th>{{ i18n.t('payments.amount') }}</th>
                <th>{{ i18n.t('payments.method') }}</th>
                <th>{{ i18n.t('payments.pago') }}</th>
                <th>{{ i18n.t('payments.verificacion') }}</th>
                <th>Gmail</th>
                <th>{{ i18n.t('payments.date') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (pago of filteredPagos(); track pago.id) {
                <tr>
                  <td><strong class="text-primary">{{ pago.codigoReserva }}</strong></td>
                  <td>{{ pago.proveedor?.nombre }}</td>
                  <td>{{ getClientName(pago) }}</td>
                  <td>
                    <strong>{{ formatCurrency(pago.monto, pago.moneda) }}</strong>
                  </td>
                  <td>
                    <span class="method-badge" [class.tarjeta]="pago.tipoMedioPago === 'TARJETA'">
                      {{ pago.tipoMedioPago === 'TARJETA' ? i18n.t('filter.cards') : i18n.t('filter.accounts') }}
                      @if (pago.tipoMedioPago === 'TARJETA') {
                        <span>****{{ pago.tarjeta?.ultimos4Digitos || '0000' }}</span>
                      }
                    </span>
                  </td>
                  <td>
                    @if (pago.pagado) {
                      <span class="badge badge-paid">{{ i18n.t('status.paid') }}</span>
                    } @else {
                      <span class="badge badge-pending">{{ i18n.t('status.pending') }}</span>
                    }
                  </td>
                  <td>
                    @if (pago.verificado) {
                      <span class="badge badge-verified">{{ i18n.t('status.verified') }}</span>
                    } @else {
                      <span class="badge badge-pending">{{ i18n.t('payments.non_verified') }}</span>
                    }
                  </td>
                  <td>
                    @if (pago.gmailEnviado) {
                      <span>{{ i18n.t('emails.sent') }}</span>
                    } @else {
                      <span>{{ i18n.t('emails.pending') }}</span>
                    }
                  </td>
                  <td class="text-muted">{{ formatDate(pago.fechaCreacion) }}</td>
                  <td>
                    <div class="actions-cell">
                      <button class="btn btn-icon btn-sm" title="{{ i18n.t('actions.view') }}" (click)="openViewModal(pago)">👁️</button>
                      <button class="btn btn-icon btn-sm" title="{{ i18n.t('actions.edit') }}" [disabled]="pago.verificado" (click)="openEditModal(pago)">✏️</button>
                      <button class="btn btn-icon btn-sm" title="{{ i18n.t('actions.delete') }}" (click)="deletePago(pago.id)" [disabled]="pago.gmailEnviado">🗑️</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                @if (!loading()) {
                  <tr>
                    <td colspan="10" class="text-center text-muted">
                      {{ i18n.t('msg.no_data') }}
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <app-pago-modal
        [isOpen]="isModalOpen"
        [pago]="selectedPago"
        [viewOnly]="isViewOnly"
        (closed)="closeModal()"
        (saved)="onPagoSaved($event)"
      />
    </div>
  `,
  styles: [`
    .pagos-page {
      position: relative;
    }
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      border-radius: var(--border-radius);
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--spacing-sm);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .filters-row {
      display: flex;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .filter-group {
      flex: 1;
      min-width: 180px;
    }

    .method-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;

      &.tarjeta {
        color: var(--primary-color);
      }
    }

    .actions-cell {
      display: flex;
      gap: 4px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-color);

      &:hover:not(:disabled) {
        background: var(--bg-hover);
        border-color: var(--primary-color);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
  `]
})
export class PagosListComponent implements OnInit {
  i18n = inject(I18nService);
  private pagosService = inject(PagosService);
  
  searchQuery = '';
  filterStatus = '';
  filterMethod = '';
  
  loading = signal(false);
  pagos = signal<Pago[]>([]);

  // Modal handling
  isModalOpen = false;
  isViewOnly = false;
  selectedPago?: Pago;

  ngOnInit(): void {
    this.loadPagos();
  }

  loadPagos(): void {
    this.loading.set(true);
    const filters: any = {};
    if (this.filterStatus) filters.estado = this.filterStatus.toUpperCase();
    
    this.pagosService.getPagos(filters).subscribe({
      next: (data) => {
        this.pagos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando pagos:', err);
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isViewOnly = false;
    this.selectedPago = undefined;
    this.isModalOpen = true;
  }

  openEditModal(pago: Pago): void {
    this.isViewOnly = false;
    this.selectedPago = pago;
    this.isModalOpen = true;
  }

  openViewModal(pago: Pago): void {
    this.isViewOnly = true;
    this.selectedPago = pago;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPago = undefined;
  }

  onPagoSaved(pago: Pago): void {
    this.loadPagos();
    this.closeModal();
  }

  deletePago(id: number): void {
    if (confirm(this.i18n.t('msg.confirm_delete_payment'))) {
      this.pagosService.cancelarPago(id).subscribe({
        next: () => this.loadPagos(),
        error: (err) => console.error('Error eliminando pago:', err)
      });
    }
  }

  filteredPagos = computed(() => {
    const query = this.searchQuery.toLowerCase();
    const status = this.filterStatus;
    const method = this.filterMethod;
    
    return this.pagos().filter(p => {
      const matchesSearch = !query || 
        p.codigoReserva.toLowerCase().includes(query) ||
        p.proveedor?.nombre.toLowerCase().includes(query);
      
      const matchesStatus = !status ||
        (status === 'pending' && !p.pagado) ||
        (status === 'paid' && p.pagado && !p.verificado) ||
        (status === 'verified' && p.verificado);
      
      const matchesMethod = !method || p.tipoMedioPago === method;
      
      return matchesSearch && matchesStatus && matchesMethod;
    });
  });

  formatCurrency(amount: number, currency: string = 'CAD'): string {
    return new Intl.NumberFormat(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES');
  }

  getClientName(pago: Pago): string {
    if (pago.clientes && pago.clientes.length > 0) {
      return pago.clientes.map(c => c.cliente?.nombre).join(', ');
    }
    return '';
  }
}
