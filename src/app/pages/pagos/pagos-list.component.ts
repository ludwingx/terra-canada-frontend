import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';
import { Pago } from '../../models/interfaces';
import { PagoModalComponent } from '../../components/modals/pago-modal/pago-modal.component';

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
          <p class="header-subtitle">{{ pagos.length }} {{ i18n.language() === 'fr' ? 'paiements' : 'pagos' }}</p>
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
              <option value="">{{ i18n.language() === 'fr' ? 'Tous les statuts' : 'Todos los estados' }}</option>
              <option value="pending">{{ i18n.t('status.pending') }}</option>
              <option value="paid">{{ i18n.t('status.paid') }}</option>
              <option value="verified">{{ i18n.t('status.verified') }}</option>
            </select>
          </div>
          <div class="filter-group">
            <select class="form-control" [(ngModel)]="filterMethod">
              <option value="">{{ i18n.language() === 'fr' ? 'Tous les moyens' : 'Todos los medios' }}</option>
              <option value="TARJETA">{{ i18n.language() === 'fr' ? 'Cartes' : 'Tarjetas' }}</option>
              <option value="CUENTA_BANCARIA">{{ i18n.language() === 'fr' ? 'Comptes' : 'Cuentas' }}</option>
            </select>
          </div>
          <button class="btn btn-secondary">
            {{ i18n.t('actions.filter') }}
          </button>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('payments.code') }}</th>
                <th>{{ i18n.t('payments.supplier') }}</th>
                <th>{{ i18n.t('payments.client') }}</th>
                <th>{{ i18n.t('payments.amount') }}</th>
                <th>{{ i18n.t('payments.method') }}</th>
                <th>{{ i18n.language() === 'fr' ? 'Paiement' : 'Pago' }}</th>
                <th>{{ i18n.language() === 'fr' ? 'Vérification' : 'Verificación' }}</th>
                <th>{{ i18n.language() === 'fr' ? 'Gmail' : 'Gmail' }}</th>
                <th>{{ i18n.t('payments.date') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (pago of filteredPagos; track pago.id) {
                <tr>
                  <td><strong class="text-primary">{{ pago.codigoReserva }}</strong></td>
                  <td>{{ pago.proveedor?.nombre }}</td>
                  <td>{{ getClientName(pago) }}</td>
                  <td>
                    <strong>{{ formatCurrency(pago.monto, pago.moneda) }}</strong>
                  </td>
                  <td>
                    <span class="method-badge" [class.tarjeta]="pago.tipoMedioPago === 'TARJETA'">
                      {{ pago.tipoMedioPago === 'TARJETA' ? (i18n.language() === 'fr' ? 'Carte' : 'Tarjeta') : (i18n.language() === 'fr' ? 'Compte' : 'Cuenta') }}
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
                      <span class="badge badge-pending">{{ i18n.language() === 'fr' ? 'Non vérifié' : 'No verificado' }}</span>
                    }
                  </td>
                  <td>
                    @if (pago.gmailEnviado) {
                      <span>{{ i18n.language() === 'fr' ? 'Envoyé' : 'Enviado' }}</span>
                    } @else {
                      <span>{{ i18n.language() === 'fr' ? 'En attente' : 'Pendiente' }}</span>
                    }
                  </td>
                  <td class="text-muted">{{ formatDate(pago.fechaCreacion) }}</td>
                  <td>
                    <div class="actions-cell">
                      <button class="btn btn-icon btn-sm" title="{{ i18n.t('actions.view') }}">👁️</button>
                      <button class="btn btn-icon btn-sm" title="{{ i18n.t('actions.edit') }}" [disabled]="pago.verificado" (click)="openEditModal(pago)">✏️</button>
                      <button class="btn btn-icon btn-sm" title="{{ i18n.t('actions.delete') }}" [disabled]="pago.gmailEnviado">🗑️</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="10" class="text-center text-muted">
                    {{ i18n.t('msg.no_data') }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <app-pago-modal
        [isOpen]="isModalOpen"
        [pago]="selectedPago"
        (closed)="closeModal()"
        (saved)="onPagoSaved($event)"
      />
    </div>
  `,
  styles: [`
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
export class PagosListComponent {
  i18n = inject(I18nService);
  
  searchQuery = '';
  filterStatus = '';
  filterMethod = '';

  // Modal handling
  isModalOpen = false;
  selectedPago?: Pago;

  pagos: Pago[] = [
    { id: 1, proveedorId: 1, proveedor: { id: 1, nombre: 'Voyage Excellence', servicioId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-001', monto: 2500.00, moneda: 'CAD', tipoMedioPago: 'TARJETA', tarjeta: { id: 1, nombreTitular: 'Terra Canada', ultimos4Digitos: '4521', moneda: 'CAD', limiteMensual: 10000, saldoDisponible: 7500, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, pagado: true, verificado: true, gmailEnviado: true, activo: true, fechaCreacion: new Date('2026-01-28'), fechaActualizacion: new Date() },
    { id: 2, proveedorId: 2, proveedor: { id: 2, nombre: 'Canada Tours', servicioId: 2, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-002', monto: 1800.00, moneda: 'USD', tipoMedioPago: 'CUENTA_BANCARIA', pagado: true, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date('2026-01-27'), fechaActualizacion: new Date() },
    { id: 3, proveedorId: 3, proveedor: { id: 3, nombre: 'Assurance Plus', servicioId: 3, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-003', monto: 950.00, moneda: 'CAD', tipoMedioPago: 'TARJETA', tarjeta: { id: 2, nombreTitular: 'Terra Canada', ultimos4Digitos: '8832', moneda: 'CAD', limiteMensual: 15000, saldoDisponible: 12000, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, pagado: false, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date('2026-01-26'), fechaActualizacion: new Date() },
    { id: 4, proveedorId: 1, proveedor: { id: 1, nombre: 'Voyage Excellence', servicioId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-004', monto: 3200.00, moneda: 'USD', tipoMedioPago: 'TARJETA', tarjeta: { id: 1, nombreTitular: 'Terra Canada', ultimos4Digitos: '4521', moneda: 'USD', limiteMensual: 10000, saldoDisponible: 5000, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, pagado: true, verificado: true, gmailEnviado: true, activo: true, fechaCreacion: new Date('2026-01-25'), fechaActualizacion: new Date() },
    { id: 5, proveedorId: 4, proveedor: { id: 4, nombre: 'Location Auto QC', servicioId: 4, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-005', monto: 780.00, moneda: 'CAD', tipoMedioPago: 'CUENTA_BANCARIA', pagado: true, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date('2026-01-24'), fechaActualizacion: new Date() },
    { id: 6, proveedorId: 5, proveedor: { id: 5, nombre: 'Guides Montreal', servicioId: 5, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, usuarioId: 1, codigoReserva: 'RES-2026-006', monto: 1250.00, moneda: 'CAD', tipoMedioPago: 'TARJETA', tarjeta: { id: 2, nombreTitular: 'Terra Canada', ultimos4Digitos: '8832', moneda: 'CAD', limiteMensual: 15000, saldoDisponible: 10750, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, pagado: false, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date('2026-01-23'), fechaActualizacion: new Date() }
  ];

  openCreateModal(): void {
    this.selectedPago = undefined;
    this.isModalOpen = true;
  }

  openEditModal(pago: Pago): void {
    this.selectedPago = pago;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPago = undefined;
  }

  onPagoSaved(pago: Pago): void {
    if (this.selectedPago) {
      const idx = this.pagos.findIndex(p => p.id === pago.id);
      if (idx >= 0) {
        this.pagos[idx] = pago;
      }
    } else {
      pago.id = this.pagos.length ? Math.max(...this.pagos.map(p => p.id)) + 1 : 1;
      this.pagos.push(pago);
    }
    this.closeModal();
  }

  get filteredPagos(): Pago[] {
    return this.pagos.filter(p => {
      const matchesSearch = !this.searchQuery || 
        p.codigoReserva.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.proveedor?.nombre.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = !this.filterStatus ||
        (this.filterStatus === 'pending' && !p.pagado) ||
        (this.filterStatus === 'paid' && p.pagado && !p.verificado) ||
        (this.filterStatus === 'verified' && p.verificado);
      
      const matchesMethod = !this.filterMethod || p.tipoMedioPago === this.filterMethod;
      
      return matchesSearch && matchesStatus && matchesMethod;
    });
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

  getClientName(pago: Pago): string {
    if (pago.clientes && pago.clientes.length > 0) {
      return pago.clientes.map(c => c.cliente?.nombre).join(', ');
    }
    return 'Hôtel Example';
  }
}
