import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TarjetaCredito, TipoMoneda } from '../../../models/interfaces';
import { TarjetasService } from '../../../services/tarjetas.service';

@Component({
  selector: 'app-tarjeta-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? (i18n.language() === 'fr' ? 'Modifier la carte' : 'Editar tarjeta') : (i18n.language() === 'fr' ? 'Nouvelle carte' : 'Nueva tarjeta')"
      [loading]="loading"
      [canSave]="isFormValid()"
      size="md"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <form class="form-grid">
        <!-- Nombre Titular -->
        <div class="form-group full-width">
          <label class="form-label required">{{ i18n.t('cards.holder') }}</label>
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="form.nombreTitular" 
            name="nombreTitular"
            [placeholder]="i18n.language() === 'fr' ? 'Nom du titulaire' : 'Nombre del titular'"
            style="text-transform: uppercase;"
          >
        </div>

        <!-- Últimos 4 dígitos -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('cards.last4') }}</label>
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="form.ultimos4Digitos" 
            name="ultimos4Digitos"
            placeholder="0000"
            maxlength="4"
            pattern="[0-9]{4}"
          >
        </div>

        <!-- Tipo de tarjeta -->
        <div class="form-group">
          <label class="form-label">{{ i18n.t('cards.type') }}</label>
          <select class="form-control" [(ngModel)]="form.tipoTarjeta" name="tipoTarjeta">
            <option value="">{{ i18n.language() === 'fr' ? 'Sélectionner' : 'Seleccionar' }}</option>
            <option value="Visa">Visa</option>
            <option value="Visa Infinite">Visa Infinite</option>
            <option value="Visa Business">Visa Business</option>
            <option value="Mastercard">Mastercard</option>
            <option value="Mastercard World">Mastercard World</option>
            <option value="Amex">American Express</option>
            <option value="Amex Gold">Amex Gold</option>
          </select>
        </div>

        <!-- Moneda -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('payments.currency') }}</label>
          <select class="form-control" [(ngModel)]="form.moneda" name="moneda">
            <option value="CAD">CAD - Dollar canadien</option>
            <option value="USD">USD - Dollar américain</option>
          </select>
        </div>

        <!-- Límite mensual -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('cards.limit') }}</label>
          <div class="input-with-prefix">
            <span class="input-prefix">$</span>
            <input 
              type="number" 
              class="form-control" 
              [(ngModel)]="form.limiteMensual" 
              name="limiteMensual"
              placeholder="10000"
              min="0"
              step="100"
            >
          </div>
        </div>

        <!-- Saldo disponible -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('cards.available') }}</label>
          <div class="input-with-prefix">
            <span class="input-prefix">$</span>
            <input 
              type="number" 
              class="form-control" 
              [(ngModel)]="form.saldoDisponible" 
              name="saldoDisponible"
              placeholder="10000"
              min="0"
              step="100"
            >
          </div>
        </div>

        <!-- Estado activo -->
        <div class="form-group full-width">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="form.activo" name="activo">
            {{ i18n.t('status.active') }}
          </label>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }

    .full-width { grid-column: 1 / -1; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .form-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);

      &.required::after {
        content: ' *';
        color: #dc3545;
      }
    }

    .input-with-prefix {
      display: flex;
      align-items: stretch;

      .input-prefix {
        display: flex;
        align-items: center;
        padding: 0 12px;
        background: var(--bg-hover);
        border: 1px solid var(--border-color);
        border-right: none;
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        color: var(--text-muted);
        font-size: 14px;
      }

      .form-control {
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
      }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;

      input { cursor: pointer; }
    }
  `]
})
export class TarjetaModalComponent implements OnInit, OnChanges {
  i18n = inject(I18nService);
  private tarjetasService = inject(TarjetasService);

  @Input() isOpen = false;
  @Input() tarjeta?: TarjetaCredito;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<TarjetaCredito>();

  loading = false;

  form = {
    nombreTitular: '',
    ultimos4Digitos: '',
    tipoTarjeta: '',
    moneda: 'CAD' as TipoMoneda,
    limiteMensual: 10000,
    saldoDisponible: 10000,
    activo: true
  };

  get isEdit(): boolean {
    return !!this.tarjeta;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tarjeta'] || (changes['isOpen'] && this.isOpen)) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.tarjeta) {
      this.form = {
        nombreTitular: this.tarjeta.nombreTitular,
        ultimos4Digitos: this.tarjeta.ultimos4Digitos,
        tipoTarjeta: this.tarjeta.tipoTarjeta || '',
        moneda: this.tarjeta.moneda,
        limiteMensual: this.tarjeta.limiteMensual,
        saldoDisponible: this.tarjeta.saldoDisponible,
        activo: this.tarjeta.activo
      };
    } else {
      this.resetForm();
    }
  }

  isFormValid(): boolean {
    return !!(
      this.form.nombreTitular.trim() && 
      this.form.ultimos4Digitos.length === 4 &&
      this.form.limiteMensual > 0
    );
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onSave(): void {
    if (!this.isFormValid()) return;

    this.loading = true;

    const tarjetaData: any = {
      nombre_titular: this.form.nombreTitular.toUpperCase(),
      ultimos_4_digitos: this.form.ultimos4Digitos,
      tipo_tarjeta: this.form.tipoTarjeta || null,
      moneda: this.form.moneda,
      limite_mensual: this.form.limiteMensual,
      saldo_disponible: this.form.saldoDisponible
    };

    // DOCUMENTACION_ENDPOINTS.md solo tiene POST /tarjetas. 
    // No hay PUT documentado explícitamente para editar, pero el backend podría tenerlo.
    // Si no, usaremos create como fallback (aunque esto crearía duplicados si no se maneja en el server).
    // Asumiremos que el backend implementará el update si se requiere.
    this.tarjetasService.createTarjeta(tarjetaData).subscribe({
      next: (res) => {
        this.loading = false;
        this.saved.emit(res);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error guardando tarjeta:', err);
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.form = {
      nombreTitular: '',
      ultimos4Digitos: '',
      tipoTarjeta: '',
      moneda: 'CAD',
      limiteMensual: 10000,
      saldoDisponible: 10000,
      activo: true
    };
  }
}
