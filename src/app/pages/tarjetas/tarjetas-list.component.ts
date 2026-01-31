import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { TarjetaCredito } from '../../models/interfaces';
import { TarjetaModalComponent } from '../../components/modals/tarjeta-modal/tarjeta-modal.component';
import { TarjetasService } from '../../services/tarjetas.service';

@Component({
  selector: 'app-tarjetas-list',
  standalone: true,
  imports: [CommonModule, TarjetaModalComponent],
  template: `
    <div class="tarjetas-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('cards.title') }}</h1>
          <p class="header-subtitle">{{ tarjetas().length }} {{ i18n.t('cards.count') }}</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span>➕</span>
          {{ i18n.t('cards.new') }}
        </button>
      </div>

      <!-- Table Card -->
      <div class="card relative">
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
                <th>{{ i18n.t('cards.holder') }}</th>
                <th>{{ i18n.t('cards.type') }}</th>
                <th>{{ i18n.t('cards.last4') }}</th>
                <th>{{ i18n.t('payments.currency') }}</th>
                <th>{{ i18n.t('cards.limit') }}</th>
                <th>{{ i18n.t('cards.available') }}</th>
                <th>{{ i18n.t('cards.usage') }}</th>
                <th>{{ i18n.t('payments.status') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (tarjeta of tarjetas(); track tarjeta.id) {
                <tr [class.inactive-row]="!tarjeta.activo">
                  <td>
                    <div class="holder-cell">
                      <span class="card-icon-sm">💳</span>
                      <strong>{{ tarjeta.nombreTitular }}</strong>
                    </div>
                  </td>
                  <td>{{ tarjeta.tipoTarjeta || 'Visa' }}</td>
                  <td><code>****{{ tarjeta.ultimos4Digitos }}</code></td>
                  <td>
                    <span class="badge badge-paid">{{ tarjeta.moneda }}</span>
                  </td>
                  <td>{{ formatCurrency(tarjeta.limiteMensual, tarjeta.moneda) }}</td>
                  <td>
                    <span [class.low-balance]="getUsagePercentage(tarjeta) > 80">
                      {{ formatCurrency(tarjeta.saldoDisponible, tarjeta.moneda) }}
                    </span>
                  </td>
                  <td>
                    <div class="usage-mini-bar">
                      <div 
                        class="usage-fill" 
                        [style.width.%]="getUsagePercentage(tarjeta)"
                        [class.critical]="getUsagePercentage(tarjeta) > 80"
                      ></div>
                    </div>
                  </td>
                  <td>
                    @if (tarjeta.activo) {
                      <span class="badge badge-paid">{{ i18n.t('status.active') }}</span>
                    } @else {
                      <span class="badge badge-inactive">{{ i18n.t('status.inactive') }}</span>
                    }
                  </td>
                  <td>
                    <div class="actions-cell">
                      <button class="btn btn-secondary btn-sm" (click)="openEditModal(tarjeta)">{{ i18n.t('actions.edit') }}</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                @if (!loading()) {
                  <tr>
                    <td colspan="9" class="text-center text-muted">
                      {{ i18n.t('msg.no_data') }}
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <app-tarjeta-modal
        [isOpen]="isModalOpen"
        [tarjeta]="selectedTarjeta"
        (closed)="closeModal()"
        (saved)="onTarjetaSaved($event)"
      />
    </div>
  `,
  styles: [`
    .tarjetas-page {
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
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-lg);
    }

    .credit-card {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-lg);
      color: white;
      position: relative;
      overflow: hidden;
      min-height: 280px;
      display: flex;
      flex-direction: column;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
      }

      &.inactive {
        opacity: 0.6;
        filter: grayscale(50%);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .card-type {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 14px;
      font-weight: 500;
    }

    .card-icon {
      font-size: 24px;
    }

    .card-currency {
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .card-number {
      font-size: 20px;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      margin-bottom: var(--spacing-md);
    }

    .card-holder {
      font-size: 14px;
      color: rgba(255,255,255,0.8);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: var(--spacing-lg);
    }

    .card-balance {
      background: rgba(255,255,255,0.1);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .balance-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }

    .balance-label {
      font-size: 12px;
      color: rgba(255,255,255,0.7);
    }

    .balance-value {
      font-size: 18px;
      font-weight: 700;

      &.low {
        color: #ff6b6b;
      }
    }

    .balance-bar {
      height: 6px;
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: var(--spacing-xs);
    }

    .balance-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-light), #4ade80);
      border-radius: 3px;
      transition: width var(--transition-normal);

      &.low {
        background: linear-gradient(90deg, #ff6b6b, #ffa500);
      }
    }

    .balance-limit {
      font-size: 11px;
      color: rgba(255,255,255,0.5);
      text-align: right;
    }

    .card-actions {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: auto;

      .btn {
        flex: 1;
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.2);
        color: white;

        &:hover {
          background: rgba(255,255,255,0.2);
        }

        &.btn-primary {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }
      }
    }

    .inactive-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .no-data {
      grid-column: 1 / -1;
      padding: var(--spacing-xl);
    }
  `]
})
export class TarjetasListComponent implements OnInit {
  i18n = inject(I18nService);
  private tarjetasService = inject(TarjetasService);
  
  loading = signal(false);
  tarjetas = signal<TarjetaCredito[]>([]);

  // Modal handling
  isModalOpen = false;
  selectedTarjeta?: TarjetaCredito;

  ngOnInit(): void {
    this.loadTarjetas();
  }

  loadTarjetas(): void {
    this.loading.set(true);
    this.tarjetasService.getTarjetas().subscribe({
      next: (data) => {
        this.tarjetas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando tarjetas:', err);
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.selectedTarjeta = undefined;
    this.isModalOpen = true;
  }

  openEditModal(tarjeta: TarjetaCredito): void {
    this.selectedTarjeta = tarjeta;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTarjeta = undefined;
  }

  onTarjetaSaved(tarjeta: TarjetaCredito): void {
    this.loadTarjetas();
    this.closeModal();
  }

  formatCurrency(amount: any, currency: string = 'CAD'): string {
    const value = Number(amount || 0);
    return new Intl.NumberFormat(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', {
      style: 'currency',
      currency: currency || 'CAD'
    }).format(isNaN(value) ? 0 : value);
  }

  getUsagePercentage(tarjeta: TarjetaCredito): number {
    if (!tarjeta.limiteMensual || tarjeta.limiteMensual <= 0) return 0;
    const usage = ((tarjeta.limiteMensual - tarjeta.saldoDisponible) / tarjeta.limiteMensual) * 100;
    return isNaN(usage) ? 0 : Math.max(0, usage);
  }
}
