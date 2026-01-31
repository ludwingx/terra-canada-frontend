import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { ClientesService } from '../../../services/clientes.service';
import { ProveedoresService } from '../../../services/proveedores.service';
import { TarjetasService } from '../../../services/tarjetas.service';
import { PagosService } from '../../../services/pagos.service';
import { Cliente, Proveedor, TarjetaCredito, Pago } from '../../../models/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePickerModule } from 'primeng/datepicker';

// Interfaces locales para display
interface ProveedorDisplay {
  id: string;
  nombre: string;
  servicio: string;
  correo?: string;
  correo2?: string; // Ensure interfaces match or adapt
}

interface ClienteDisplay {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe, DatePickerModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() isVisible = false;
  @Input() enableAutomaticNumeroPresta = false;
  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  // Servicios
  private clientesService = inject(ClientesService);
  private proveedoresService = inject(ProveedoresService);
  private tarjetasService = inject(TarjetasService);
  private pagosService = inject(PagosService);

  // Datos
  clientes: ClienteDisplay[] = [];
  proveedores: ProveedorDisplay[] = [];
  tarjetas: TarjetaCredito[] = [];

  tarjetaSeleccionada: TarjetaCredito | null = null;
  tarjetasFiltradas: TarjetaCredito[] = [];
  monedaSeleccionada: string | null = null; // Changed to string type based on interfaces

  monedasDisponibles = [
    { id: 'USD', nombre: 'USD - Dólar Estadounidense' },
    { id: 'CAD', nombre: 'CAD - Dólar Canadiense' }
  ];

  // Logic from reference
  currentYear: number = new Date().getFullYear();
  numeroPrestaAutomatico = false;
  generandoNumeroPresta = false;
  numeroPrestaError: string | null = null;

  clientesFiltrados: ClienteDisplay[] = [];
  proveedoresFiltrados: ProveedorDisplay[] = [];
  mostrarClientesDropdown = false;
  mostrarProveedoresDropdown = false;

  correosDisponibles: string[] = [];
  mostrarDropdownCorreos = false;
  proveedorSeleccionado: ProveedorDisplay | null = null;

  // Modal Nuevo Cliente/Proveedor (Simplificado/Omitido por ahora si es complejo, pero lo incluiré)
  mostrarModalNuevoCliente = false;
  mostrarModalNuevoProveedor = false;
  
  // Variables para nuevos registros
  nuevoClienteNombre = '';
  nuevoClienteUbicacion = '';
  nuevoClienteTelefono = '';
  nuevoClienteCorreo = '';

  nuevoProveedorNombre = '';
  nuevoProveedorServicio = '';
  nuevoProveedorTelefono = '';
  nuevoProveedorTelefono2 = ''; // Check if Proveedor has this
  nuevoProveedorCorreo = '';
  nuevoProveedorCorreo2 = ''; // Check if Proveedor has this
  nuevoProveedorDescripcion = '';


  // Fecha futura draft
  draftFechaFutura: Date | null = null;
  fechaFuturaFocused = false;

  constructor() {}

  ngOnInit(): void {
    this.initializeFormListeners();
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
    // Clientes
    this.clientesService.getClientes().pipe(takeUntil(this.destroy$)).subscribe((clientes: Cliente[]) => {
      this.clientes = clientes.map(c => ({
        id: c.id.toString(),
        nombre: c.nombre
      }));
      this.cdr.markForCheck();
    });

    // Proveedores
    this.proveedoresService.getProveedores().pipe(takeUntil(this.destroy$)).subscribe((proveedores: Proveedor[]) => {
      this.proveedores = proveedores.map(p => ({
        id: p.id.toString(),
        nombre: p.nombre,
        servicio: p.servicio?.nombre || 'General', // Adaptado
        correo: (p.correos && p.correos.length > 0) ? p.correos[0].correo : undefined
        // correo2 handling needed if array
      }));
      this.cdr.markForCheck();
    });

    // Tarjetas
    this.tarjetasService.getTarjetas().pipe(takeUntil(this.destroy$)).subscribe((tarjetas: TarjetaCredito[]) => {
      this.tarjetas = tarjetas;
      if (this.monedaSeleccionada) {
        this.onSeleccionarMoneda(this.monedaSeleccionada);
      }
      this.cdr.markForCheck();
    });
  }

  private initializeFormListeners(): void {
    if (this.form.get('clienteNombre')) {
      this.form.get('clienteNombre')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((valor: string) => {
        this.filtrarClientes(valor);
      });
    }

    if (this.form.get('proveedorNombre')) {
      this.form.get('proveedorNombre')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((valor: string) => {
        this.filtrarProveedores(valor);
      });
    }

    if (this.form.get('moneda')) {
      this.form.get('moneda')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((monedaId: any) => {
        this.onSeleccionarMoneda(monedaId);
      });
    }

    if (this.form.get('tarjeta')) {
      this.form.get('tarjeta')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((tarjetaId: any) => {
        if (tarjetaId) {
          const id = parseInt(tarjetaId, 10);
          this.onSeleccionarTarjeta(id);
        }
      });
    }
  }

  filtrarClientes(valor: string): void {
    if (!valor || valor.trim() === '') {
      this.clientesFiltrados = [];
      this.mostrarClientesDropdown = false;
      return;
    }
    const valorLower = valor.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(valorLower)
    );
    this.mostrarClientesDropdown = this.clientesFiltrados.length > 0;
    this.cdr.markForCheck();
  }

  filtrarProveedores(valor: string): void {
     if (!valor || valor.trim() === '') {
      this.proveedoresFiltrados = [];
      this.mostrarProveedoresDropdown = false;
      return;
    }
    const valorLower = valor.toLowerCase();
    this.proveedoresFiltrados = this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(valorLower)
    );
    this.mostrarProveedoresDropdown = this.proveedoresFiltrados.length > 0;
    this.cdr.markForCheck();
  }

  // ... (Other UI methods: onClienteFocus, etc. similar to reference) ...
  onClienteFocus(): void {
    if (this.clientes.length > 0) {
      this.clientesFiltrados = this.clientes;
      this.mostrarClientesDropdown = true;
    }
  }

  onClienteBlur(): void {
    setTimeout(() => {
      this.mostrarClientesDropdown = false;
      this.cdr.markForCheck();
    }, 200);
  }

  onProveedorFocus(): void {
    if (this.proveedores.length > 0) {
      this.proveedoresFiltrados = this.proveedores;
      this.mostrarProveedoresDropdown = true;
    }
  }

  onProveedorBlur(): void {
    setTimeout(() => {
      this.mostrarProveedoresDropdown = false;
      this.cdr.markForCheck();
    }, 200);
  }

  seleccionarCliente(cliente: ClienteDisplay): void {
    this.form.patchValue({ cliente: cliente.id }, { emitEvent: false });
    this.form.patchValue({ clienteNombre: cliente.nombre }, { emitEvent: false });
    this.mostrarClientesDropdown = false;
  }

  seleccionarProveedor(proveedor: ProveedorDisplay): void {
    this.form.patchValue({ proveedor: proveedor.id }, { emitEvent: false });
    this.form.patchValue({ proveedorNombre: proveedor.nombre }, { emitEvent: false });
    this.mostrarProveedoresDropdown = false;
    this.proveedorSeleccionado = proveedor;

    this.correosDisponibles = [];
    if (proveedor.correo) this.correosDisponibles.push(proveedor.correo);
    // if (proveedor.correo2) this.correosDisponibles.push(proveedor.correo2);

    if (this.correosDisponibles.length > 0) {
      this.form.patchValue({ correo: this.correosDisponibles[0] }, { emitEvent: false });
      this.mostrarDropdownCorreos = this.correosDisponibles.length > 1;
    } else {
      this.form.patchValue({ correo: '' }, { emitEvent: false });
      this.mostrarDropdownCorreos = false;
    }
  }

  seleccionarCorreo(correo: string): void {
    this.form.patchValue({ correo: correo }, { emitEvent: false });
    this.mostrarDropdownCorreos = false;
  }

  onSeleccionarMoneda(monedaId: string): void {
    this.monedaSeleccionada = monedaId;
    this.tarjetasFiltradas = this.tarjetas.filter(t => t.moneda === monedaId && t.activo);
    
    // Clear selected card if mismatch
    this.form.patchValue({ tarjeta: '' }, { emitEvent: false });
    this.tarjetaSeleccionada = null;
    this.cdr.markForCheck();
  }

  onSeleccionarTarjeta(tarjetaId: number): void {
    const tarjeta = this.tarjetasFiltradas.find(t => t.id === tarjetaId);
    this.tarjetaSeleccionada = tarjeta || null;
  }

  // --- Modals Nuevo Cliente/Proveedor ---
  abrirModalNuevoCliente(): void { this.mostrarModalNuevoCliente = true; }
  cerrarModalNuevoCliente(): void { this.mostrarModalNuevoCliente = false; }
  
  guardarNuevoCliente(): void {
    if(!this.nuevoClienteNombre) return;
    const nuevo: any = { // Adapta a partial Cliente
        nombre: this.nuevoClienteNombre,
        ubicacion: this.nuevoClienteUbicacion,
        telefono: this.nuevoClienteTelefono,
        correo: this.nuevoClienteCorreo,
        activo: true
    };
    this.clientesService.createCliente(nuevo).subscribe((res: any) => {
        // Handle success
        const display = { id: res.id.toString(), nombre: res.nombre };
        this.clientes.push(display);
        this.seleccionarCliente(display);
        this.cerrarModalNuevoCliente();
    });
  }

  abrirModalNuevoProveedor(): void { this.mostrarModalNuevoProveedor = true; }
  cerrarModalNuevoProveedor(): void { this.mostrarModalNuevoProveedor = false; }

  guardarNuevoProveedor(): void {
    if(!this.nuevoProveedorNombre) return;
    const nuevo: any = { // Adapta a partial Proveedor
        nombre: this.nuevoProveedorNombre,
        // servicioId: ... need service selection? assume 1 for now or add field
        servicioId: 1, // Default or mock
        telefono: this.nuevoProveedorTelefono,
        descripcion: this.nuevoProveedorDescripcion,
        activo: true
    };
    // Correo logic might be separate in new API. 
    this.proveedoresService.createProveedor(nuevo).subscribe((res: any) => {
        const display = { id: res.id.toString(), nombre: res.nombre, servicio: 'General', correo: this.nuevoProveedorCorreo };
        this.proveedores.push(display);
        this.seleccionarProveedor(display);
        this.cerrarModalNuevoProveedor();
        // If email provided, add it separately?
        if(this.nuevoProveedorCorreo) {
            this.proveedoresService.addCorreo(res.id, { correo: this.nuevoProveedorCorreo, principal: true }).subscribe();
        }
    });
  }

  // --- Fecha futura logic ---
  syncDraftFechaFutura(): void {
    const val = this.form?.get('fechaFutura')?.value;
    this.draftFechaFutura = val ? new Date(val) : null;
  }
  applyDraftFechaFutura(val: Date | null): void {
      this.draftFechaFutura = val;
      this.form.get('fechaFutura')?.setValue(val);
  }
  clearDraftFechaFutura(): void {
      this.draftFechaFutura = null;
      this.form.get('fechaFutura')?.setValue(null);
  }
  setDraftFechaFuturaToNow(): void {
      this.draftFechaFutura = new Date();
      this.form.get('fechaFutura')?.setValue(this.draftFechaFutura);
  }
  revertDraftFechaFutura(): void {
      this.syncDraftFechaFutura();
  }

  // --- N° Presta ---
  setNumeroPrestaModo(automatico: boolean): void {
      this.numeroPrestaAutomatico = automatico;
      const control = this.form.get('numeroPresta');
      if(control) {
          if(automatico) {
              control.setValue('');
              this.generarNumeroPrestaAutomatico();
          } else {
             // Let user type
          }
      }
  }

  private generarNumeroPrestaAutomatico(): void {
      this.generandoNumeroPresta = true;
      this.pagosService.getPagos().subscribe({
          next: (pagos: Pago[]) => {
              let nextId = 1;
              if(pagos.length > 0) {
                 const ids = pagos.map((p: any) => p.id).filter((id: any) => !isNaN(id));
                 if(ids.length > 0) nextId = Math.max(...ids) + 1;
              }
              const year = new Date().getFullYear();
              const codigo = `T${year}${nextId}`;
              this.form.get('numeroPresta')?.setValue(codigo);
              this.generandoNumeroPresta = false;
              this.cdr.markForCheck();
          },
          error: () => {
              this.numeroPrestaError = 'Error generando ID';
              this.generandoNumeroPresta = false;
              this.cdr.markForCheck();
          }
      });
  }

  onSubmit(): void { this.submit.emit(); }
  onCancel(): void { this.cancel.emit(); }
}
