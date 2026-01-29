import { Component, inject, OnInit } from '@angular/core';
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
          <p class="header-subtitle">{{ tarjetas.length }} {{ i18n.language() === 'fr' ? 'cartes enregistrées' : 'tarjetas registradas' }}</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span>➕</span>
          {{ i18n.t('cards.new') }}
        </button>
      </div>

      <!-- Cards Grid -->
      <div class="cards-grid">
        @for (tarjeta of tarjetas; track tarjeta.id) {
          <div class="credit-card" [class.inactive]="!tarjeta.activo">
            <div class="card-header">
              <div class="card-type">
                <span class="card-icon">💳</span>
                <span>{{ tarjeta.tipoTarjeta || 'Visa' }}</span>
              </div>
              <div class="card-currency">{{ tarjeta.moneda }}</div>
            </div>

            <div class="card-number">
              **** **** **** {{ tarjeta.ultimos4Digitos }}
            </div>

            <div class="card-holder">
              {{ tarjeta.nombreTitular }}
            </div>

            <div class="card-balance">
              <div class="balance-info">
                <span class="balance-label">{{ i18n.t('cards.available') }}</span>
                <span class="balance-value" [class.low]="getUsagePercentage(tarjeta) > 80">
                  {{ formatCurrency(tarjeta.saldoDisponible, tarjeta.moneda) }}
                </span>
              </div>
              <div class="balance-bar">
                <div 
                  class="balance-fill" 
                  [style.width.%]="100 - getUsagePercentage(tarjeta)"
                  [class.low]="getUsagePercentage(tarjeta) > 80"
                ></div>
              </div>
              <div class="balance-limit">
                {{ i18n.t('cards.limit') }}: {{ formatCurrency(tarjeta.limiteMensual, tarjeta.moneda) }}
              </div>
            </div>

            <div class="card-actions">
              <button class="btn btn-secondary btn-sm">{{ i18n.t('actions.view') }}</button>
              <button class="btn btn-primary btn-sm" (click)="openEditModal(tarjeta)">{{ i18n.t('actions.edit') }}</button>
            </div>

            @if (!tarjeta.activo) {
              <div class="inactive-overlay">
                <span>{{ i18n.t('status.inactive') }}</span>
              </div>
            }
          </div>
        }
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
  `]
})
export class TarjetasListComponent implements OnInit {
  i18n = inject(I18nService);
  private tarjetasService = inject(TarjetasService);
  
  loading = false;

  // Modal handling
  isModalOpen = false;
  selectedTarjeta?: TarjetaCredito;

  tarjetas: TarjetaCredito[] = [];

  ngOnInit(): void {
    this.loadTarjetas();
  }

  loadTarjetas(): void {
    this.loading = true;
    this.tarjetasService.getTarjetas().subscribe({
      next: (tarjetas) => {
        this.tarjetas = tarjetas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando tarjetas:', err);
        this.loading = false;
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

  formatCurrency(amount: number, currency: string = 'CAD'): string {
    return new Intl.NumberFormat(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  getUsagePercentage(tarjeta: TarjetaCredito): number {
    return ((tarjeta.limiteMensual - tarjeta.saldoDisponible) / tarjeta.limiteMensual) * 100;
  }
}
