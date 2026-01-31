import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { CuentaBancaria, TipoMoneda } from '../../../models/interfaces';
import { CuentasService } from '../../../services/cuentas.service';

@Component({
  selector: 'app-cuenta-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? i18n.t('actions.edit_account') : i18n.t('actions.new_account')"
      [loading]="loading"
      [canSave]="isFormValid()"
      size="md"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <form class="form-stack">
        <!-- Nombre del Banco -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('accounts.bank') }}</label>
          <select class="form-control" [(ngModel)]="form.nombreBanco" name="nombreBanco">
            <option value="">{{ i18n.t('accounts.select_bank') }}</option>
            <option value="Banque Nationale">Banque Nationale</option>
            <option value="TD Bank">TD Bank</option>
            <option value="Desjardins">Desjardins</option>
            <option value="RBC">RBC Royal Bank</option>
            <option value="BMO">BMO</option>
            <option value="Scotiabank">Scotiabank</option>
            <option value="CIBC">CIBC</option>
          </select>
        </div>

        <!-- Nombre de la Cuenta -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('accounts.name') }}</label>
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="form.nombreCuenta" 
            name="nombreCuenta"
            [placeholder]="i18n.t('accounts.name_placeholder')"
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

        <!-- Moneda -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('payments.currency') }}</label>
          <select class="form-control" [(ngModel)]="form.moneda" name="moneda">
            <option value="CAD">CAD - Dollar canadien</option>
            <option value="USD">USD - Dollar américain</option>
          </select>
        </div>

        <!-- Estado activo -->
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="form.activo" name="activo">
            {{ i18n.t('status.active') }}
          </label>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-stack {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

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
export class CuentaModalComponent implements OnInit, OnChanges {
  i18n = inject(I18nService);
  private cuentasService = inject(CuentasService);

  @Input() isOpen = false;
  @Input() cuenta?: CuentaBancaria;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CuentaBancaria>();

  loading = false;

  form = {
    nombreBanco: '',
    nombreCuenta: '',
    ultimos4Digitos: '',
    moneda: 'CAD' as TipoMoneda,
    activo: true
  };

  get isEdit(): boolean {
    return !!this.cuenta;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cuenta'] || (changes['isOpen'] && this.isOpen)) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.cuenta) {
      // Normalize bank name if it comes in Spanish but the UI uses French/English
      let nombreBanco = this.cuenta.nombreBanco;
      if (nombreBanco === 'Banco Nacional de Canadá') nombreBanco = 'Banque Nationale';
      if (nombreBanco === 'Royal Bank') nombreBanco = 'RBC';

      this.form = {
        nombreBanco: nombreBanco,
        nombreCuenta: this.cuenta.nombreCuenta,
        ultimos4Digitos: this.cuenta.ultimos4Digitos,
        moneda: this.cuenta.moneda,
        activo: this.cuenta.activo
      };
    } else {
      this.resetForm();
    }
  }

  isFormValid(): boolean {
    return !!(
      this.form.nombreBanco && 
      this.form.nombreCuenta.trim() &&
      this.form.ultimos4Digitos.length === 4
    );
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onSave(): void {
    if (!this.isFormValid()) return;

    this.loading = true;

    const cuentaData: any = {
      nombre_banco: this.form.nombreBanco,
      nombre_cuenta: this.form.nombreCuenta,
      ultimos_4_digitos: this.form.ultimos4Digitos,
      moneda: this.form.moneda
    };

    // DOCUMENTACION_ENDPOINTS.md solo tiene POST /cuentas.
    this.cuentasService.createCuenta(cuentaData).subscribe({
      next: (res) => {
        this.loading = false;
        this.saved.emit(res);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error guardando cuenta:', err);
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.form = {
      nombreBanco: '',
      nombreCuenta: '',
      ultimos4Digitos: '',
      moneda: 'CAD',
      activo: true
    };
  }
}
