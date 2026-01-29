import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { CuentaBancaria, TipoMoneda } from '../../../models/interfaces';

@Component({
  selector: 'app-cuenta-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? (i18n.language() === 'fr' ? 'Modifier le compte' : 'Editar cuenta') : (i18n.language() === 'fr' ? 'Nouveau compte' : 'Nueva cuenta')"
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
            <option value="">{{ i18n.language() === 'fr' ? 'Sélectionner une banque' : 'Seleccionar un banco' }}</option>
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
            [placeholder]="i18n.language() === 'fr' ? 'Ex: Compte Opérations' : 'Ej: Cuenta Operaciones'"
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
export class CuentaModalComponent implements OnInit {
  i18n = inject(I18nService);

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
    if (this.cuenta) {
      this.form = {
        nombreBanco: this.cuenta.nombreBanco,
        nombreCuenta: this.cuenta.nombreCuenta,
        ultimos4Digitos: this.cuenta.ultimos4Digitos,
        moneda: this.cuenta.moneda,
        activo: this.cuenta.activo
      };
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

    const cuenta: CuentaBancaria = {
      id: this.cuenta?.id || 0,
      nombreBanco: this.form.nombreBanco,
      nombreCuenta: this.form.nombreCuenta,
      ultimos4Digitos: this.form.ultimos4Digitos,
      moneda: this.form.moneda,
      activo: this.form.activo,
      fechaCreacion: this.cuenta?.fechaCreacion || new Date(),
      fechaActualizacion: new Date()
    };

    setTimeout(() => {
      this.loading = false;
      this.saved.emit(cuenta);
      this.resetForm();
    }, 500);
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
