import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { EnvioCorreo, Proveedor, Pago } from '../../../models/interfaces';

// Datos de ejemplo
const PROVEEDORES: Proveedor[] = [
  { id: 1, nombre: 'Voyage Excellence', servicioId: 1, activo: true, 
    correos: [
      { id: 1, proveedorId: 1, correo: 'contact@voyage-excellence.ca', principal: true, activo: true, fechaCreacion: new Date() },
      { id: 2, proveedorId: 1, correo: 'facturas@voyage-excellence.ca', principal: false, activo: true, fechaCreacion: new Date() }
    ],
    fechaCreacion: new Date(), fechaActualizacion: new Date() 
  },
  { id: 2, nombre: 'Canada Tours', servicioId: 2, activo: true, 
    correos: [
      { id: 3, proveedorId: 2, correo: 'info@canadatours.com', principal: true, activo: true, fechaCreacion: new Date() }
    ],
    fechaCreacion: new Date(), fechaActualizacion: new Date() 
  },
];

const PAGOS_PENDIENTES: Pago[] = [
  { id: 1, proveedorId: 1, usuarioId: 1, codigoReserva: 'RES-2026-001', monto: 2500, moneda: 'CAD', tipoMedioPago: 'TARJETA', pagado: true, verificado: true, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 2, proveedorId: 1, usuarioId: 1, codigoReserva: 'RES-2026-004', monto: 3200, moneda: 'USD', tipoMedioPago: 'TARJETA', pagado: true, verificado: true, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 3, proveedorId: 2, usuarioId: 1, codigoReserva: 'RES-2026-002', monto: 1800, moneda: 'CAD', tipoMedioPago: 'CUENTA_BANCARIA', pagado: true, verificado: true, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
];

@Component({
  selector: 'app-correo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? (i18n.language() === 'fr' ? 'Modifier le courriel' : 'Editar correo') : (i18n.language() === 'fr' ? 'Nouveau courriel' : 'Nuevo correo')"
      [loading]="loading"
      [canSave]="isFormValid()"
      [saveButtonText]="i18n.language() === 'fr' ? 'Enregistrer comme brouillon' : 'Guardar como borrador'"
      size="xl"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <div class="correo-layout">
        <!-- Sidebar de selección -->
        <div class="correo-sidebar">
          <h4>{{ i18n.t('payments.supplier') }}</h4>
          <select class="form-control" [(ngModel)]="form.proveedorId" (ngModelChange)="onProveedorChange()">
            <option [ngValue]="null">{{ i18n.language() === 'fr' ? 'Sélectionner' : 'Seleccionar' }}</option>
            @for (p of proveedores; track p.id) {
              <option [ngValue]="p.id">{{ p.nombre }}</option>
            }
          </select>

          @if (form.proveedorId) {
            <h4 class="mt-3">{{ i18n.t('emails.recipient') }}</h4>
            <div class="correos-radio">
              @for (correo of correosFiltrados; track correo.id) {
                <label class="radio-item" [class.selected]="form.correoSeleccionado === correo.correo">
                  <input 
                    type="radio" 
                    name="correoSeleccionado" 
                    [value]="correo.correo" 
                    [(ngModel)]="form.correoSeleccionado"
                  >
                  {{ correo.correo }}
                  @if (correo.principal) {
                    <span class="principal-tag">★</span>
                  }
                </label>
              }
            </div>

            <h4 class="mt-3">{{ i18n.language() === 'fr' ? 'Paiements à inclure' : 'Pagos a incluir' }}</h4>
            <div class="pagos-list">
              @for (pago of pagosDelProveedor; track pago.id) {
                <label class="pago-item" [class.selected]="isPagoSelected(pago.id)">
                  <input 
                    type="checkbox"
                    [checked]="isPagoSelected(pago.id)"
                    (change)="togglePago(pago.id)"
                  >
                  <span class="pago-code">{{ pago.codigoReserva }}</span>
                  <span class="pago-amount">{{ formatCurrency(pago.monto, pago.moneda) }}</span>
                </label>
              }
            </div>
          }
        </div>

        <!-- Editor de correo -->
        <div class="correo-editor">
          <div class="form-group">
            <label class="form-label required">{{ i18n.t('emails.subject') }}</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="form.asunto" 
              placeholder="Notification de paiements - Janvier 2026"
            >
          </div>

          <div class="form-group flex-grow">
            <label class="form-label required">{{ i18n.language() === 'fr' ? 'Corps du message' : 'Cuerpo del mensaje' }}</label>
            <textarea 
              class="form-control full-height" 
              [(ngModel)]="form.cuerpo"
              [placeholder]="getPlaceholderBody()"
            ></textarea>
          </div>

          <!-- Resumen -->
          <div class="correo-summary">
            <div class="summary-item">
              <span class="summary-label">{{ i18n.t('emails.payment_count') }}:</span>
              <span class="summary-value">{{ form.pagosIds.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">{{ i18n.t('emails.total_amount') }}:</span>
              <span class="summary-value total">{{ formatTotal() }}</span>
            </div>
          </div>
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    .correo-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--spacing-lg);
      height: 500px;
    }

    .correo-sidebar {
      padding: var(--spacing-md);
      background: var(--bg-hover);
      border-radius: var(--border-radius);
      overflow-y: auto;

      h4 {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--text-muted);
        margin: 0 0 var(--spacing-sm);
      }
    }

    .mt-3 { margin-top: var(--spacing-lg); }

    .correos-radio {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .radio-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: 12px;
      word-break: break-all;

      &:hover { border-color: var(--primary-color); }
      &.selected { 
        border-color: var(--primary-color);
        background: rgba(45, 122, 122, 0.1);
      }

      input { cursor: pointer; }
    }

    .principal-tag {
      color: #ffc107;
      margin-left: auto;
    }

    .pagos-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .pago-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: 12px;

      &:hover { border-color: var(--primary-color); }
      &.selected { 
        border-color: var(--primary-color);
        background: rgba(45, 122, 122, 0.1);
      }

      .pago-code { flex: 1; font-weight: 500; }
      .pago-amount { color: var(--primary-color); font-weight: 600; }
    }

    .correo-editor {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);

      &.flex-grow { flex: 1; }
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

    .full-height {
      flex: 1;
      min-height: 200px;
      resize: none;
    }

    .correo-summary {
      display: flex;
      gap: var(--spacing-lg);
      padding: var(--spacing-md);
      background: rgba(45, 122, 122, 0.1);
      border-radius: var(--border-radius);
    }

    .summary-item {
      display: flex;
      gap: var(--spacing-sm);
    }

    .summary-label {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .summary-value {
      font-weight: 600;
      color: var(--text-primary);

      &.total { color: var(--primary-color); font-size: 16px; }
    }
  `]
})
export class CorreoModalComponent implements OnInit, OnChanges {
  i18n = inject(I18nService);

  @Input() isOpen = false;
  @Input() correo?: EnvioCorreo;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<EnvioCorreo>();

  loading = false;
  proveedores = PROVEEDORES;
  todosPagos = PAGOS_PENDIENTES;

  form = {
    proveedorId: null as number | null,
    correoSeleccionado: '',
    asunto: '',
    cuerpo: '',
    pagosIds: [] as number[]
  };

  get isEdit(): boolean {
    return !!this.correo;
  }

  get correosFiltrados() {
    const prov = this.proveedores.find(p => p.id === this.form.proveedorId);
    return prov?.correos || [];
  }

  get pagosDelProveedor(): Pago[] {
    return this.todosPagos.filter(p => p.proveedorId === this.form.proveedorId && p.verificado && !p.gmailEnviado);
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    this.initForm();
  }

  private initForm(): void {
    if (this.correo) {
      this.form = {
        proveedorId: this.correo.proveedorId,
        correoSeleccionado: this.correo.correoSeleccionado,
        asunto: this.correo.asunto,
        cuerpo: this.correo.cuerpo,
        pagosIds: this.correo.detalles?.map(d => d.pagoId) || []
      };
    }
  }

  onProveedorChange(): void {
    const correos = this.correosFiltrados;
    const principal = correos.find(c => c.principal);
    this.form.correoSeleccionado = principal?.correo || correos[0]?.correo || '';
    this.form.pagosIds = [];
    
    // Auto-seleccionar todos los pagos del proveedor
    this.form.pagosIds = this.pagosDelProveedor.map(p => p.id);
  }

  isPagoSelected(id: number): boolean {
    return this.form.pagosIds.includes(id);
  }

  togglePago(id: number): void {
    const idx = this.form.pagosIds.indexOf(id);
    if (idx >= 0) {
      this.form.pagosIds.splice(idx, 1);
    } else {
      this.form.pagosIds.push(id);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.form.proveedorId &&
      this.form.correoSeleccionado &&
      this.form.asunto.trim() &&
      this.form.pagosIds.length > 0
    );
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatTotal(): string {
    const pagosSeleccionados = this.todosPagos.filter(p => this.form.pagosIds.includes(p.id));
    const total = pagosSeleccionados.reduce((sum, p) => sum + p.monto, 0);
    return this.formatCurrency(total, 'CAD');
  }

  getPlaceholderBody(): string {
    if (this.i18n.language() === 'fr') {
      return `Bonjour,

Nous vous informons que les paiements suivants ont été effectués :

[Liste des paiements]

Cordialement,
Terra Canada`;
    }
    return `Estimados,

Les informamos que los siguientes pagos han sido realizados:

[Lista de pagos]

Saludos cordiales,
Terra Canada`;
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onSave(): void {
    if (!this.isFormValid()) return;

    this.loading = true;

    const pagosSeleccionados = this.todosPagos.filter(p => this.form.pagosIds.includes(p.id));
    const montoTotal = pagosSeleccionados.reduce((sum, p) => sum + p.monto, 0);

    const correo: EnvioCorreo = {
      id: this.correo?.id || 0,
      proveedorId: this.form.proveedorId!,
      proveedor: this.proveedores.find(p => p.id === this.form.proveedorId),
      correoSeleccionado: this.form.correoSeleccionado,
      usuarioEnvioId: 1,
      asunto: this.form.asunto,
      cuerpo: this.form.cuerpo,
      estado: 'BORRADOR',
      cantidadPagos: this.form.pagosIds.length,
      montoTotal: montoTotal,
      fechaGeneracion: new Date(),
      detalles: this.form.pagosIds.map(pagoId => ({
        id: 0,
        envioId: 0,
        pagoId: pagoId,
        pago: this.todosPagos.find(p => p.id === pagoId),
        fechaCreacion: new Date()
      }))
    };

    setTimeout(() => {
      this.loading = false;
      this.saved.emit(correo);
      this.resetForm();
    }, 500);
  }

  private resetForm(): void {
    this.form = {
      proveedorId: null,
      correoSeleccionado: '',
      asunto: '',
      cuerpo: '',
      pagosIds: []
    };
  }
}
