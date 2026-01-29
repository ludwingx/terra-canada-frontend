import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { Documento, TipoDocumento, Pago } from '../../../models/interfaces';

// Pagos de ejemplo para asociar
const PAGOS: Pago[] = [
  { id: 1, proveedorId: 1, usuarioId: 1, codigoReserva: 'RES-2026-001', monto: 2500, moneda: 'CAD', tipoMedioPago: 'TARJETA', pagado: true, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 2, proveedorId: 2, usuarioId: 1, codigoReserva: 'RES-2026-002', monto: 1800, moneda: 'USD', tipoMedioPago: 'CUENTA_BANCARIA', pagado: true, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 3, proveedorId: 3, usuarioId: 1, codigoReserva: 'RES-2026-003', monto: 950, moneda: 'CAD', tipoMedioPago: 'TARJETA', pagado: false, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
];

@Component({
  selector: 'app-documento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="i18n.language() === 'fr' ? 'Télécharger un document' : 'Subir documento'"
      [loading]="loading"
      [canSave]="isFormValid()"
      [saveButtonText]="i18n.language() === 'fr' ? 'Télécharger' : 'Subir'"
      size="md"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <form class="form-stack">
        <!-- Tipo de documento -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('documents.type') }}</label>
          <div class="type-cards">
            <label class="type-card" [class.selected]="form.tipoDocumento === 'FACTURA'">
              <input type="radio" name="tipoDocumento" value="FACTURA" [(ngModel)]="form.tipoDocumento">
              <span class="type-icon">🧾</span>
              <span class="type-name">{{ i18n.t('documents.invoice') }}</span>
              <span class="type-desc">{{ i18n.language() === 'fr' ? 'Facture du fournisseur' : 'Factura del proveedor' }}</span>
            </label>
            <label class="type-card" [class.selected]="form.tipoDocumento === 'DOCUMENTO_BANCO'">
              <input type="radio" name="tipoDocumento" value="DOCUMENTO_BANCO" [(ngModel)]="form.tipoDocumento">
              <span class="type-icon">🏦</span>
              <span class="type-name">{{ i18n.t('documents.bank_doc') }}</span>
              <span class="type-desc">{{ i18n.language() === 'fr' ? 'Relevé bancaire pour vérification' : 'Extracto bancario para verificación' }}</span>
            </label>
          </div>
        </div>

        <!-- Asociar a pago (solo para facturas) -->
        @if (form.tipoDocumento === 'FACTURA') {
          <div class="form-group">
            <label class="form-label">{{ i18n.language() === 'fr' ? 'Associer au paiement' : 'Asociar a pago' }}</label>
            <select class="form-control" [(ngModel)]="form.pagoId" name="pagoId">
              <option [ngValue]="null">{{ i18n.language() === 'fr' ? 'Aucun' : 'Ninguno' }}</option>
              @for (pago of pagos; track pago.id) {
                <option [ngValue]="pago.id">{{ pago.codigoReserva }} - {{ formatCurrency(pago.monto, pago.moneda) }}</option>
              }
            </select>
          </div>
        }

        <!-- Información sobre documentos bancarios -->
        @if (form.tipoDocumento === 'DOCUMENTO_BANCO') {
          <div class="info-box">
            <span class="info-icon">ℹ️</span>
            <p>{{ i18n.language() === 'fr' ? 'Les documents bancaires sont utilisés pour vérifier les paiements. Une fois téléchargé, vous pourrez sélectionner les paiements à marquer comme vérifiés.' : 'Los documentos bancarios se usan para verificar pagos. Una vez subido, podrás seleccionar los pagos a marcar como verificados.' }}</p>
          </div>
        }

        <!-- Archivo -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.language() === 'fr' ? 'Fichier' : 'Archivo' }}</label>
          <div 
            class="file-dropzone" 
            [class.has-file]="form.file"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event)"
          >
            @if (form.file) {
              <div class="file-preview">
                <span class="file-icon">📄</span>
                <span class="file-name">{{ form.file.name }}</span>
                <span class="file-size">{{ formatFileSize(form.file.size) }}</span>
                <button type="button" class="remove-file" (click)="removeFile()">×</button>
              </div>
            } @else {
              <div class="dropzone-content">
                <span class="dropzone-icon">📁</span>
                <p>{{ i18n.language() === 'fr' ? 'Glissez-déposez un fichier ici ou' : 'Arrastra un archivo aquí o' }}</p>
                <label class="file-select-btn">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileSelected($event)">
                  {{ i18n.language() === 'fr' ? 'Parcourir' : 'Seleccionar' }}
                </label>
                <small>PDF, JPG, PNG (max 10MB)</small>
              </div>
            }
          </div>
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

    .type-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-sm);
    }

    .type-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-md);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: center;

      input {
        position: absolute;
        opacity: 0;
      }

      &:hover {
        border-color: var(--primary-color);
      }

      &.selected {
        border-color: var(--primary-color);
        background: rgba(45, 122, 122, 0.1);
      }
    }

    .type-icon { font-size: 28px; }
    .type-name { font-weight: 600; font-size: 13px; color: var(--text-primary); }
    .type-desc { font-size: 11px; color: var(--text-muted); }

    .info-box {
      display: flex;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background: rgba(45, 122, 122, 0.1);
      border-radius: var(--border-radius);
      border-left: 3px solid var(--primary-color);

      .info-icon { font-size: 18px; }
      p { font-size: 12px; color: var(--text-secondary); margin: 0; }
    }

    .file-dropzone {
      border: 2px dashed var(--border-color);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      text-align: center;
      transition: all var(--transition-fast);

      &:hover, &.dragover {
        border-color: var(--primary-color);
        background: rgba(45, 122, 122, 0.05);
      }

      &.has-file {
        border-style: solid;
        background: var(--bg-hover);
      }
    }

    .dropzone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);

      .dropzone-icon { font-size: 32px; }
      p { margin: 0; font-size: 13px; color: var(--text-secondary); }
      small { font-size: 11px; color: var(--text-muted); }
    }

    .file-select-btn {
      display: inline-block;
      padding: 6px 16px;
      background: var(--primary-color);
      color: white;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: 13px;
      margin-top: var(--spacing-xs);

      input { display: none; }

      &:hover { background: var(--primary-dark); }
    }

    .file-preview {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      .file-icon { font-size: 24px; }
      .file-name { font-weight: 500; font-size: 14px; color: var(--text-primary); }
      .file-size { font-size: 12px; color: var(--text-muted); }
    }

    .remove-file {
      margin-left: auto;
      width: 24px;
      height: 24px;
      border: none;
      background: #fee2e2;
      color: #dc3545;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;

      &:hover { background: #dc3545; color: white; }
    }
  `]
})
export class DocumentoModalComponent {
  i18n = inject(I18nService);

  @Input() isOpen = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Documento>();

  loading = false;
  pagos = PAGOS;

  form = {
    tipoDocumento: 'FACTURA' as TipoDocumento,
    pagoId: null as number | null,
    file: null as File | null
  };

  isFormValid(): boolean {
    return !!(this.form.tipoDocumento && this.form.file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.form.file = files[0];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.form.file = input.files[0];
    }
  }

  removeFile(): void {
    this.form.file = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onSave(): void {
    if (!this.isFormValid() || !this.form.file) return;

    this.loading = true;

    const documento: Documento = {
      id: 0,
      usuarioId: 1, // Usuario actual
      pagoId: this.form.pagoId || undefined,
      pago: this.form.pagoId ? this.pagos.find(p => p.id === this.form.pagoId) : undefined,
      nombreArchivo: this.form.file.name,
      urlDocumento: `/documents/${Date.now()}_${this.form.file.name}`,
      tipoDocumento: this.form.tipoDocumento,
      fechaSubida: new Date()
    };

    setTimeout(() => {
      this.loading = false;
      this.saved.emit(documento);
      this.resetForm();
    }, 800);
  }

  private resetForm(): void {
    this.form = {
      tipoDocumento: 'FACTURA',
      pagoId: null,
      file: null
    };
  }
}
