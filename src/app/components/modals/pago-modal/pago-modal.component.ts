import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ClienteModalComponent } from '../cliente-modal/cliente-modal.component';
import { Pago, Proveedor, TarjetaCredito, CuentaBancaria, TipoMoneda, TipoMedioPago, Cliente } from '../../../models/interfaces';
import { ProveedoresService } from '../../../services/proveedores.service';
import { TarjetasService } from '../../../services/tarjetas.service';
import { CuentasService } from '../../../services/cuentas.service';
import { ClientesService } from '../../../services/clientes.service';
import { PagosService } from '../../../services/pagos.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pago-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ClienteModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? i18n.t('payments.edit_title') : i18n.t('payments.new_title')"
      [loading]="loading"
      [canSave]="isFormValid()"
      size="lg"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <form class="form-grid">
        <div class="section full-width">
          <div class="section-title">{{ i18n.t('payments.info_section') }}</div>
          <div class="section-grid">
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
                <option [ngValue]="null">{{ i18n.t('payments.select_supplier') }}</option>
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
          </div>
        </div>

        <div class="section full-width">
          <div class="section-title">{{ i18n.t('payments.method') }}</div>
          <div class="payment-methods">
            <button
              type="button"
              class="method-card"
              [class.active]="form.tipoMedioPago === 'TARJETA'"
              (click)="form.tipoMedioPago = 'TARJETA'; onTipoChange()"
            >
              <div class="method-icon">💳</div>
              <div class="method-name">{{ i18n.t('cards.title') }}</div>
              <div class="method-desc">{{ i18n.t('payments.select_card_hint') }}</div>
            </button>
            <button
              type="button"
              class="method-card"
              [class.active]="form.tipoMedioPago === 'CUENTA_BANCARIA'"
              (click)="form.tipoMedioPago = 'CUENTA_BANCARIA'; onTipoChange()"
            >
              <div class="method-icon">🏦</div>
              <div class="method-name">{{ i18n.t('accounts.title') }}</div>
              <div class="method-desc">{{ i18n.t('payments.select_account_hint') }}</div>
            </button>
          </div>

          <div class="section-grid mt">
            <!-- Selección de Tarjeta/Cuenta -->
            <div class="form-group">
              @if (form.tipoMedioPago === 'TARJETA') {
                <label class="form-label required">{{ i18n.t('filter.cards') }}</label>
                <select class="form-control" [(ngModel)]="form.tarjetaId" name="tarjetaId">
                  <option [ngValue]="null">{{ i18n.t('actions.select') }}</option>
                  @for (t of tarjetasFiltradas; track t.id) {
                    <option [ngValue]="t.id">****{{ t.ultimos4Digitos }} - {{ t.nombreTitular }} ({{ formatCurrency(t.saldoDisponible, t.moneda) }})</option>
                  }
                </select>
              } @else {
                <label class="form-label required">{{ i18n.t('filter.accounts') }}</label>
                <select class="form-control" [(ngModel)]="form.cuentaBancariaId" name="cuentaBancariaId">
                  <option [ngValue]="null">{{ i18n.t('actions.select') }}</option>
                  @for (c of cuentasFiltradas; track c.id) {
                    <option [ngValue]="c.id">{{ c.nombreBanco }} - ****{{ c.ultimos4Digitos }} ({{ c.moneda }})</option>
                  }
                </select>
              }
            </div>
          </div>
        </div>

        <!-- Clientes asociados -->
        <div class="form-group full-width">
          <div class="clientes-header">
            <label class="form-label">{{ i18n.t('payments.associated_clients') }}</label>
            @if (!isEdit) {
              <button type="button" class="btn btn-secondary btn-sm" (click)="openNewClienteModal()">
                + {{ i18n.t('clients.new') }}
              </button>
            }
          </div>
          <div class="multi-select">
            <div class="selected-chips">
              @for (c of selectedClientes; track c.id) {
                <span class="chip">
                  <span class="chip-text">{{ c.nombre }}</span>
                  <button type="button" class="chip-remove" (click)="removeCliente(c.id)">×</button>
                </span>
              }
              <input
                type="text"
                class="chip-input"
                [placeholder]="i18n.t('payments.add_client_placeholder')"
                [(ngModel)]="clienteSearch"
                name="clienteSearch"
                (focus)="openClienteDropdown()"
                (blur)="onClienteInputBlur()"
                (ngModelChange)="openClienteDropdown()"
              >
            </div>

            @if (isClienteDropdownOpen) {
              <div class="dropdown">
                @for (cliente of clientesFiltrados; track cliente.id) {
                  <button
                    type="button"
                    class="dropdown-item"
                    (mousedown)="selectCliente(cliente.id); $event.preventDefault()"
                  >
                    {{ cliente.nombre }}
                  </button>
                } @empty {
                  <div class="dropdown-empty">{{ i18n.t('msg.no_data') }}</div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Fecha esperada de débito -->
        <div class="form-group">
          <label class="form-label">{{ i18n.t('payments.expected_debit_date') }}</label>
          <input 
            type="date" 
            class="form-control" 
            [(ngModel)]="form.fechaEsperadaDebito" 
            name="fechaEsperadaDebito"
          >
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label class="form-label">{{ i18n.t('audit.description') }}</label>
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

      <app-cliente-modal
        [isOpen]="isClienteModalOpen"
        (closed)="closeClienteModal()"
        (saved)="onClienteCreated($event)"
      />
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

    .section {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
    }

    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: var(--spacing-sm);
      letter-spacing: 0.02em;
    }

    .section-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }

    .mt {
      margin-top: var(--spacing-md);
    }

    .payment-methods {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-sm);
    }

    .method-card {
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius);
      background: var(--bg-card);
      padding: var(--spacing-md);
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      flex-direction: column;
      gap: 4px;

      &:hover {
        border-color: var(--primary-color);
        background: rgba(45, 122, 122, 0.05);
      }

      &.active {
        border-color: var(--primary-color);
        background: rgba(45, 122, 122, 0.12);
      }
    }

    .method-icon { font-size: 20px; }
    .method-name { font-weight: 600; font-size: 13px; color: var(--text-primary); }
    .method-desc { font-size: 12px; color: var(--text-muted); }

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

    .clientes-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-sm);
    }

    .multi-select {
      position: relative;
    }

    .selected-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
      padding: 8px;
      background: var(--bg-hover);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      min-height: 42px;
      align-items: center;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(45, 122, 122, 0.12);
      border: 1px solid rgba(45, 122, 122, 0.25);
      border-radius: 999px;
      font-size: 12px;
      color: var(--text-primary);
    }

    .chip-remove {
      width: 18px;
      height: 18px;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;

      &:hover {
        background: rgba(0, 0, 0, 0.08);
        color: var(--text-primary);
      }
    }

    .chip-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      min-width: 180px;
      flex: 1;
      color: var(--text-primary);
    }

    .dropdown {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + 6px);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 5;
      max-height: 220px;
      overflow: auto;
    }

    .dropdown-item {
      width: 100%;
      text-align: left;
      padding: 10px 12px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--text-primary);
      font-size: 13px;

      &:hover {
        background: var(--bg-hover);
      }
    }

    .dropdown-empty {
      padding: 10px 12px;
      color: var(--text-muted);
      font-size: 13px;
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
  private proveedoresService = inject(ProveedoresService);
  private tarjetasService = inject(TarjetasService);
  private cuentasService = inject(CuentasService);
  private clientesService = inject(ClientesService);
  private pagosService = inject(PagosService);

  @Input() isOpen = false;
  @Input() pago?: Pago;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Pago>();

  loading = false;
  
  // Listas de datos reales
  proveedores: Proveedor[] = [];
  tarjetas: TarjetaCredito[] = [];
  cuentas: CuentaBancaria[] = [];
  clientes: Cliente[] = [];

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

  clienteSearch = '';
  isClienteDropdownOpen = false;

  isClienteModalOpen = false;

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
    this.loadInitialData();
    this.initForm();
  }

  loadInitialData(): void {
    this.loading = true;
    forkJoin({
      proveedores: this.proveedoresService.getProveedores(),
      tarjetas: this.tarjetasService.getTarjetas(),
      cuentas: this.cuentasService.getCuentas(),
      clientes: this.clientesService.getClientes()
    }).subscribe({
      next: (res) => {
        this.proveedores = res.proveedores;
        this.tarjetas = res.tarjetas;
        this.cuentas = res.cuentas;
        this.clientes = res.clientes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando catálogos:', err);
        this.loading = false;
      }
    });
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
    } else {
      this.form.fechaEsperadaDebito = this.todayDateInputValue();
    }
  }

  private todayDateInputValue(): string {
    return new Date().toISOString().slice(0, 10);
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

  get selectedClientes(): Cliente[] {
    return this.form.clientesIds
      .map(id => this.clientes.find(c => c.id === id))
      .filter((c): c is Cliente => !!c);
  }

  get clientesFiltrados(): Cliente[] {
    const q = this.clienteSearch.trim().toLowerCase();
    return this.clientes
      .filter(c => !this.form.clientesIds.includes(c.id))
      .filter(c => !q || c.nombre.toLowerCase().includes(q));
  }

  openClienteDropdown(): void {
    this.isClienteDropdownOpen = true;
  }

  onClienteInputBlur(): void {
    setTimeout(() => {
      this.isClienteDropdownOpen = false;
      this.clienteSearch = '';
    }, 150);
  }

  selectCliente(id: number): void {
    if (!this.form.clientesIds.includes(id)) {
      this.form.clientesIds.push(id);
    }
    this.clienteSearch = '';
    this.isClienteDropdownOpen = true;
  }

  removeCliente(id: number): void {
    const idx = this.form.clientesIds.indexOf(id);
    if (idx >= 0) {
      this.form.clientesIds.splice(idx, 1);
    }
  }

  openNewClienteModal(): void {
    this.isClienteModalOpen = true;
  }

  closeClienteModal(): void {
    this.isClienteModalOpen = false;
  }

  onClienteCreated(cliente: Cliente): void {
    const newId = cliente.id && cliente.id !== 0
      ? cliente.id
      : (this.clientes.length ? Math.max(...this.clientes.map(c => c.id)) + 1 : 1);

    const nuevo: Cliente = {
      ...cliente,
      id: newId
    };

    this.clientes = [nuevo, ...this.clientes];

    if (!this.form.clientesIds.includes(nuevo.id)) {
      this.form.clientesIds.push(nuevo.id);
    }

    this.isClienteModalOpen = false;
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

    const pagoData: any = {
      codigoReserva: this.form.codigoReserva,
      proveedorId: this.form.proveedorId!,
      monto: this.form.monto,
      moneda: this.form.moneda,
      tipoMedioPago: this.form.tipoMedioPago,
      tarjetaId: this.form.tipoMedioPago === 'TARJETA' ? this.form.tarjetaId : null,
      cuentaBancariaId: this.form.tipoMedioPago === 'CUENTA_BANCARIA' ? this.form.cuentaBancariaId : null,
      descripcion: this.form.descripcion || undefined,
      fechaEsperadaDebito: this.form.fechaEsperadaDebito || undefined,
      pagado: this.form.pagado,
      verificado: this.form.verificado,
      clientesIds: this.form.clientesIds
    };

    const action = this.isEdit 
      ? this.pagosService.updatePago(this.pago!.id, pagoData)
      : this.pagosService.createPago(pagoData);

    action.subscribe({
      next: (pagoSaved) => {
        this.loading = false;
        this.saved.emit(pagoSaved);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error guardando pago:', err);
        this.loading = false;
      }
    });
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
      fechaEsperadaDebito: this.todayDateInputValue(),
      descripcion: '',
      pagado: false,
      verificado: false
    };

    this.clienteSearch = '';
    this.isClienteDropdownOpen = false;
    this.isClienteModalOpen = false;
  }
}
