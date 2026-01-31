import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { EnvioCorreo } from '../../models/interfaces';
import { ModalComponent } from '../../components/shared/modal/modal.component';
import { CorreosService } from '../../services/correos.service';

@Component({
  selector: 'app-correos-list',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <div class="correos-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('emails.title') }}</h1>
          <p class="header-subtitle">{{ getPendingCount() }} {{ i18n.t('emails.pending_count') }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs mb-3">
        <button class="tab" [class.active]="activeTab === 'pending'" (click)="activeTab = 'pending'">
          ⏳ {{ i18n.t('emails.pending_count') }} ({{ getPendingCount() }})
        </button>
        <button class="tab" [class.active]="activeTab === 'sent'" (click)="activeTab = 'sent'">
          ✅ {{ i18n.t('emails.sent_count') }} ({{ getSentCount() }})
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
                    <button class="btn btn-secondary btn-sm" (click)="openDetailModal(correo)">
                      👁️ {{ i18n.t('actions.view') }}
                    </button>
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

      <app-modal
        [isOpen]="isModalOpen"
        [title]="i18n.t('emails.detail_title')"
        [showFooter]="false"
        size="xl"
        (closed)="closeModal()"
      >
        @if (selectedCorreo) {
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('payments.supplier') }}</span>
              <span class="detail-value"><strong>{{ selectedCorreo.proveedor?.nombre }}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('emails.recipient') }}</span>
              <span class="detail-value">{{ selectedCorreo.correoSeleccionado }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('emails.subject') }}</span>
              <span class="detail-value">{{ selectedCorreo.asunto }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('payments.status') }}</span>
              <span class="detail-value">
                @if (selectedCorreo.estado === 'BORRADOR') {
                  <span class="badge badge-draft">{{ i18n.t('status.draft') }}</span>
                } @else {
                  <span class="badge badge-sent">{{ i18n.t('status.sent') }}</span>
                }
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('emails.payment_count') }}</span>
              <span class="detail-value">{{ selectedCorreo.detalles?.length || 0 }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('emails.total_amount') }}</span>
              <span class="detail-value"><strong>{{ formatCurrency(selectedCorreo.montoTotal) }}</strong></span>
            </div>

            <div class="payments-section">
              <h3 class="section-title">{{ i18n.t('emails.payments_included') }}</h3>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{{ i18n.t('payments.code') }}</th>
                      <th>{{ i18n.t('payments.amount') }}</th>
                      <th>{{ i18n.t('payments.method') }}</th>
                      <th>{{ i18n.t('payments.date') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (d of selectedCorreo.detalles || []; track d.id) {
                      <tr>
                        <td><strong class="text-primary">{{ d.pago?.codigoReserva || ('#' + d.pagoId) }}</strong></td>
                        <td><strong>{{ formatCurrency(d.pago?.monto || 0) }}</strong></td>
                        <td>{{ d.pago?.tipoMedioPago || '-' }}</td>
                        <td class="text-muted">{{ formatDate(d.pago?.fechaCreacion) }}</td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="4" class="text-center text-muted">{{ i18n.t('msg.no_data') }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      </app-modal>
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

    .detail-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .detail-row {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: var(--spacing-md);
      align-items: start;
    }

    .detail-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .detail-value {
      font-size: 13px;
      color: var(--text-primary);
      word-break: break-word;
    }

    .payments-section {
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }

    .section-title {
      margin: 0 0 var(--spacing-md) 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }
  `]
})
export class CorreosListComponent implements OnInit {
  i18n = inject(I18nService);
  private correosService = inject(CorreosService);
  activeTab: 'pending' | 'sent' = 'pending';

  isModalOpen = false;
  loading = false;
  selectedCorreo?: EnvioCorreo;

  correos: EnvioCorreo[] = [];

  ngOnInit(): void {
    this.loadCorreos();
  }

  loadCorreos(): void {
    this.loading = true;
    this.correosService.getCorreos().subscribe({
      next: (correos) => {
        this.correos = correos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando correos:', err);
        this.loading = false;
      }
    });
  }

  openDetailModal(correo: EnvioCorreo): void {
    this.selectedCorreo = correo;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCorreo = undefined;
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

  formatDate(date?: Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES');
  }
}
