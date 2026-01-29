import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { Pago, Proveedor, TarjetaCredito, CuentaBancaria, TipoMoneda, TipoMedioPago, Cliente } from '../../../models/interfaces';

// Datos de ejemplo (en producción vendrían del servicio)
const PROVEEDORES: Proveedor[] = [
  { id: 1, nombre: 'Voyage Excellence', servicioId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 2, nombre: 'Canada Tours', servicioId: 2, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 3, nombre: 'Assurance Plus', servicioId: 3, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 4, nombre: 'Location Auto QC', servicioId: 4, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
];

const TARJETAS: TarjetaCredito[] = [
  { id: 1, nombreTitular: 'TERRA CANADA INC', ultimos4Digitos: '4521', moneda: 'CAD', limiteMensual: 25000, saldoDisponible: 18750, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 2, nombreTitular: 'TERRA CANADA INC', ultimos4Digitos: '8832', moneda: 'CAD', limiteMensual: 15000, saldoDisponible: 12340, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 3, nombreTitular: 'TERRA CANADA INC', ultimos4Digitos: '2156', moneda: 'USD', limiteMensual: 20000, saldoDisponible: 3500, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
];

const CUENTAS: CuentaBancaria[] = [
  { id: 1, nombreBanco: 'Banque Nationale', nombreCuenta: 'Compte Opérations', ultimos4Digitos: '3421', moneda: 'CAD', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 2, nombreBanco: 'TD Bank', nombreCuenta: 'Business USD', ultimos4Digitos: '8876', moneda: 'USD', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
];

const CLIENTES: Cliente[] = [
  { id: 1, nombre: 'Hôtel Le Germain', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 2, nombre: 'Fairmont Château Frontenac', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
  { id: 3, nombre: 'Delta Hotels by Marriott', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
];

@Component({
  selector: 'app-pago-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? (i18n.language() === 'fr' ? 'Modifier le paiement' : 'Editar pago') : (i18n.language() === 'fr' ? 'Nouveau paiement' : 'Nuevo pago')"
      [loading]="loading"
      [canSave]="isFormValid()"
      size="lg"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <form class="form-grid">
        <!-- Código de Reserva -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('payments.code') }}</label>
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="form.codigoReserva" 
            name="codigoReserva"
            placeholder="RES-2026-XXX"
          >
        </div>

        <!-- Proveedor -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('payments.supplier') }}</label>
          <select class="form-control" [(ngModel)]="form.proveedorId" name="proveedorId">
            <option [ngValue]="null">{{ i18n.language() === 'fr' ? 'Sélectionner un fournisseur' : 'Seleccionar un proveedor' }}</option>
            @for (p of proveedores; track p.id) {
              <option [ngValue]="p.id">{{ p.nombre }}</option>
            }
          </select>
        </div>

        <!-- Monto -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('payments.amount') }}</label>
          <div class="input-with-prefix">
            <span class="input-prefix">$</span>
            <input 
              type="number" 
              class="form-control" 
              [(ngModel)]="form.monto" 
              name="monto"
              placeholder="0.00"
              min="0"
              step="0.01"
            >
          </div>
        </div>

        <!-- Moneda -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('payments.currency') }}</label>
          <select class="form-control" [(ngModel)]="form.moneda" name="moneda" (ngModelChange)="onMonedaChange()">
            <option value="CAD">CAD - Dollar canadien</option>
            <option value="USD">USD - Dollar américain</option>
          </select>
        </div>

        <!-- Tipo Medio de Pago -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('payments.method') }}</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="tipoMedioPago" value="TARJETA" [(ngModel)]="form.tipoMedioPago" (ngModelChange)="onTipoChange()">
              💳 {{ i18n.language() === 'fr' ? 'Carte de crédit' : 'Tarjeta de crédito' }}
            </label>
            <label class="radio-label">
              <input type="radio" name="tipoMedioPago" value="CUENTA_BANCARIA" [(ngModel)]="form.tipoMedioPago" (ngModelChange)="onTipoChange()">
              🏦 {{ i18n.language() === 'fr' ? 'Compte bancaire' : 'Cuenta bancaria' }}
            </label>
          </div>
        </div>

        <!-- Selección de Tarjeta/Cuenta -->
        <div class="form-group">
          @if (form.tipoMedioPago === 'TARJETA') {
            <label class="form-label required">{{ i18n.language() === 'fr' ? 'Carte' : 'Tarjeta' }}</label>
            <select class="form-control" [(ngModel)]="form.tarjetaId" name="tarjetaId">
              <option [ngValue]="null">{{ i18n.language() === 'fr' ? 'Sélectionner' : 'Seleccionar' }}</option>
              @for (t of tarjetasFiltradas; track t.id) {
                <option [ngValue]="t.id">****{{ t.ultimos4Digitos }} - {{ t.nombreTitular }} ({{ formatCurrency(t.saldoDisponible, t.moneda) }})</option>
              }
            </select>
          } @else {
            <label class="form-label required">{{ i18n.language() === 'fr' ? 'Compte' : 'Cuenta' }}</label>
            <select class="form-control" [(ngModel)]="form.cuentaBancariaId" name="cuentaBancariaId">
              <option [ngValue]="null">{{ i18n.language() === 'fr' ? 'Sélectionner' : 'Seleccionar' }}</option>
              @for (c of cuentasFiltradas; track c.id) {
                <option [ngValue]="c.id">{{ c.nombreBanco }} - ****{{ c.ultimos4Digitos }} ({{ c.moneda }})</option>
              }
            </select>
          }
        </div>

        <!-- Clientes asociados -->
        <div class="form-group full-width">
          <label class="form-label">{{ i18n.language() === 'fr' ? 'Clients associés (hôtels)' : 'Clientes asociados (hoteles)' }}</label>
          <div class="checkbox-list">
            @for (cliente of clientes; track cliente.id) {
              <label class="checkbox-item">
                <input 
                  type="checkbox" 
                  [checked]="isClienteSelected(cliente.id)"
                  (change)="toggleCliente(cliente.id)"
                >
                {{ cliente.nombre }}
              </label>
            }
          </div>
        </div>

        <!-- Fecha esperada de débito -->
        <div class="form-group">
          <label class="form-label">{{ i18n.language() === 'fr' ? 'Date prévue de débit' : 'Fecha esperada de débito' }}</label>
          <input 
            type="date" 
            class="form-control" 
            [(ngModel)]="form.fechaEsperadaDebito" 
            name="fechaEsperadaDebito"
          >
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label class="form-label">{{ i18n.language() === 'fr' ? 'Description' : 'Descripción' }}</label>
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="form.descripcion" 
            name="descripcion"
          >
        </div>

        <!-- Estados (solo en edición) -->
        @if (isEdit) {
          <div class="form-group full-width">
            <div class="status-toggles">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="form.pagado" name="pagado">
                {{ i18n.t('status.paid') }}
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="form.verificado" name="verificado" [disabled]="!form.pagado">
                {{ i18n.t('status.verified') }}
              </label>
            </div>
          </div>
        }
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

    .radio-group {
      display: flex;
      gap: var(--spacing-lg);
    }

    .radio-label, .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;

      input { cursor: pointer; }
    }

    .checkbox-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm) var(--spacing-lg);
      padding: var(--spacing-sm);
      background: var(--bg-hover);
      border-radius: var(--border-radius);
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 12px;
      cursor: pointer;
    }

    .status-toggles {
      display: flex;
      gap: var(--spacing-lg);
      padding: var(--spacing-sm);
      background: rgba(45, 122, 122, 0.1);
      border-radius: var(--border-radius);
    }
  `]
})
export class PagoModalComponent implements OnInit, OnChanges {
  i18n = inject(I18nService);

  @Input() isOpen = false;
  @Input() pago?: Pago;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Pago>();

  loading = false;
  proveedores = PROVEEDORES;
  tarjetas = TARJETAS;
  cuentas = CUENTAS;
  clientes = CLIENTES;

  form = {
    codigoReserva: '',
    proveedorId: null as number | null,
    monto: 0,
    moneda: 'CAD' as TipoMoneda,
    tipoMedioPago: 'TARJETA' as TipoMedioPago,
    tarjetaId: null as number | null,
    cuentaBancariaId: null as number | null,
    clientesIds: [] as number[],
    fechaEsperadaDebito: '',
    descripcion: '',
    pagado: false,
    verificado: false
  };

  get isEdit(): boolean {
    return !!this.pago;
  }

  get tarjetasFiltradas(): TarjetaCredito[] {
    return this.tarjetas.filter(t => t.moneda === this.form.moneda && t.activo);
  }

  get cuentasFiltradas(): CuentaBancaria[] {
    return this.cuentas.filter(c => c.moneda === this.form.moneda && c.activo);
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pago'] || changes['isOpen']) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.pago) {
      this.form = {
        codigoReserva: this.pago.codigoReserva,
        proveedorId: this.pago.proveedorId,
        monto: this.pago.monto,
        moneda: this.pago.moneda,
        tipoMedioPago: this.pago.tipoMedioPago,
        tarjetaId: this.pago.tarjetaId || null,
        cuentaBancariaId: this.pago.cuentaBancariaId || null,
        clientesIds: this.pago.clientes?.map(c => c.clienteId) || [],
        fechaEsperadaDebito: this.pago.fechaEsperadaDebito?.toString().split('T')[0] || '',
        descripcion: this.pago.descripcion || '',
        pagado: this.pago.pagado,
        verificado: this.pago.verificado
      };
    }
  }

  isFormValid(): boolean {
    const hasPaymentMethod = this.form.tipoMedioPago === 'TARJETA' 
      ? !!this.form.tarjetaId 
      : !!this.form.cuentaBancariaId;

    return !!(
      this.form.codigoReserva.trim() && 
      this.form.proveedorId &&
      this.form.monto > 0 &&
      hasPaymentMethod
    );
  }

  onMonedaChange(): void {
    this.form.tarjetaId = null;
    this.form.cuentaBancariaId = null;
  }

  onTipoChange(): void {
    this.form.tarjetaId = null;
    this.form.cuentaBancariaId = null;
  }

  isClienteSelected(id: number): boolean {
    return this.form.clientesIds.includes(id);
  }

  toggleCliente(id: number): void {
    const idx = this.form.clientesIds.indexOf(id);
    if (idx >= 0) {
      this.form.clientesIds.splice(idx, 1);
    } else {
      this.form.clientesIds.push(id);
    }
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
    if (!this.isFormValid()) return;

    this.loading = true;

    const pago: Pago = {
      id: this.pago?.id || 0,
      codigoReserva: this.form.codigoReserva,
      proveedorId: this.form.proveedorId!,
      proveedor: this.proveedores.find(p => p.id === this.form.proveedorId),
      usuarioId: 1, // Usuario actual (simulado)
      monto: this.form.monto,
      moneda: this.form.moneda,
      tipoMedioPago: this.form.tipoMedioPago,
      tarjetaId: this.form.tipoMedioPago === 'TARJETA' ? this.form.tarjetaId! : undefined,
      cuentaBancariaId: this.form.tipoMedioPago === 'CUENTA_BANCARIA' ? this.form.cuentaBancariaId! : undefined,
      descripcion: this.form.descripcion || undefined,
      fechaEsperadaDebito: this.form.fechaEsperadaDebito ? new Date(this.form.fechaEsperadaDebito) : undefined,
      pagado: this.form.pagado,
      verificado: this.form.verificado,
      gmailEnviado: this.pago?.gmailEnviado || false,
      activo: true,
      clientes: this.form.clientesIds.map(id => ({
        id: 0,
        pagoId: this.pago?.id || 0,
        clienteId: id,
        cliente: this.clientes.find(c => c.id === id),
        fechaCreacion: new Date()
      })),
      fechaCreacion: this.pago?.fechaCreacion || new Date(),
      fechaActualizacion: new Date()
    };

    setTimeout(() => {
      this.loading = false;
      this.saved.emit(pago);
      this.resetForm();
    }, 500);
  }

  private resetForm(): void {
    this.form = {
      codigoReserva: '',
      proveedorId: null,
      monto: 0,
      moneda: 'CAD',
      tipoMedioPago: 'TARJETA',
      tarjetaId: null,
      cuentaBancariaId: null,
      clientesIds: [],
      fechaEsperadaDebito: '',
      descripcion: '',
      pagado: false,
      verificado: false
    };
  }
}
