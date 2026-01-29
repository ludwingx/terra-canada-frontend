import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { EnvioCorreo } from '../../models/interfaces';
import { CorreoModalComponent } from '../../components/modals/correo-modal/correo-modal.component';

@Component({
  selector: 'app-correos-list',
  standalone: true,
  imports: [CommonModule, CorreoModalComponent],
  template: `
    <div class="correos-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('emails.title') }}</h1>
          <p class="header-subtitle">{{ getPendingCount() }} {{ i18n.language() === 'fr' ? 'en attente' : 'pendientes' }}</p>
        </div>
        <button class="btn btn-primary" (click)="openComposeModal()">
          <span>✏️</span>
          {{ i18n.t('emails.compose') }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs mb-3">
        <button class="tab" [class.active]="activeTab === 'pending'" (click)="activeTab = 'pending'">
          ⏳ {{ i18n.language() === 'fr' ? 'En attente' : 'Pendientes' }} ({{ getPendingCount() }})
        </button>
        <button class="tab" [class.active]="activeTab === 'sent'" (click)="activeTab = 'sent'">
          ✅ {{ i18n.language() === 'fr' ? 'Envoyés' : 'Enviados' }} ({{ getSentCount() }})
        </button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('payments.supplier') }}</th>
                <th>{{ i18n.t('emails.recipient') }}</th>
                <th>{{ i18n.t('emails.subject') }}</th>
                <th>{{ i18n.t('emails.payment_count') }}</th>
                <th>{{ i18n.t('emails.total_amount') }}</th>
                <th>{{ i18n.t('payments.status') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (correo of filteredCorreos; track correo.id) {
                <tr>
                  <td><strong>{{ correo.proveedor?.nombre }}</strong></td>
                  <td>{{ correo.correoSeleccionado }}</td>
                  <td>{{ correo.asunto }}</td>
                  <td class="text-center">{{ correo.cantidadPagos }}</td>
                  <td><strong>{{ formatCurrency(correo.montoTotal) }}</strong></td>
                  <td>
                    @if (correo.estado === 'BORRADOR') {
                      <span class="badge badge-draft">{{ i18n.t('status.draft') }}</span>
                    } @else {
                      <span class="badge badge-sent">{{ i18n.t('status.sent') }}</span>
                    }
                  </td>
                  <td>
                    @if (correo.estado === 'BORRADOR') {
                      <button class="btn btn-primary btn-sm" (click)="openEditModal(correo)">{{ i18n.t('actions.send') }}</button>
                    } @else {
                      <button class="btn btn-secondary btn-sm" (click)="openViewModal(correo)">{{ i18n.t('actions.view') }}</button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center text-muted">{{ i18n.t('msg.no_data') }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <app-correo-modal
        [isOpen]="isModalOpen"
        [correo]="selectedCorreo"
        (closed)="closeModal()"
        (saved)="onCorreoSaved($event)"
      />
    </div>
  `,
  styles: [`
    .tabs {
      display: flex;
      gap: var(--spacing-sm);
    }
    .tab {
      padding: 10px 20px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: 14px;
      color: var(--text-secondary);
      transition: all var(--transition-fast);

      &:hover { border-color: var(--primary-color); }
      &.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
    }
  `]
})
export class CorreosListComponent {
  i18n = inject(I18nService);
  activeTab: 'pending' | 'sent' = 'pending';

  isModalOpen = false;
  selectedCorreo?: EnvioCorreo;

  correos: EnvioCorreo[] = [
    { id: 1, proveedorId: 1, proveedor: { id: 1, nombre: 'Voyage Excellence', servicioId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, correoSeleccionado: 'contact@voyage-excellence.ca', usuarioEnvioId: 1, asunto: 'Notification de paiements - Janvier 2026', cuerpo: '', estado: 'BORRADOR', cantidadPagos: 3, montoTotal: 8500.00, fechaGeneracion: new Date() },
    { id: 2, proveedorId: 2, proveedor: { id: 2, nombre: 'Canada Tours', servicioId: 2, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, correoSeleccionado: 'info@canadatours.com', usuarioEnvioId: 1, asunto: 'Notification de paiements - Janvier 2026', cuerpo: '', estado: 'BORRADOR', cantidadPagos: 2, montoTotal: 4200.00, fechaGeneracion: new Date() },
    { id: 3, proveedorId: 3, proveedor: { id: 3, nombre: 'Assurance Plus', servicioId: 3, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, correoSeleccionado: 'souscription@assuranceplus.ca', usuarioEnvioId: 1, asunto: 'Notification de paiements - Décembre 2025', cuerpo: '', estado: 'ENVIADO', cantidadPagos: 5, montoTotal: 12300.00, fechaGeneracion: new Date('2025-12-28'), fechaEnvio: new Date('2025-12-30') }
  ];

  openComposeModal(): void {
    this.selectedCorreo = undefined;
    this.isModalOpen = true;
  }

  openEditModal(correo: EnvioCorreo): void {
    this.selectedCorreo = correo;
    this.isModalOpen = true;
  }

  openViewModal(correo: EnvioCorreo): void {
    this.selectedCorreo = correo;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCorreo = undefined;
  }

  onCorreoSaved(correo: EnvioCorreo): void {
    if (this.selectedCorreo) {
      const idx = this.correos.findIndex(c => c.id === correo.id);
      if (idx >= 0) this.correos[idx] = correo;
    } else {
      correo.id = this.correos.length ? Math.max(...this.correos.map(c => c.id)) + 1 : 1;
      this.correos.unshift(correo);
    }
    this.closeModal();
  }

  get filteredCorreos(): EnvioCorreo[] {
    return this.correos.filter(c => 
      this.activeTab === 'pending' ? c.estado === 'BORRADOR' : c.estado === 'ENVIADO'
    );
  }

  getPendingCount(): number { return this.correos.filter(c => c.estado === 'BORRADOR').length; }
  getSentCount(): number { return this.correos.filter(c => c.estado === 'ENVIADO').length; }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', { style: 'currency', currency: 'CAD' }).format(amount);
  }
}
