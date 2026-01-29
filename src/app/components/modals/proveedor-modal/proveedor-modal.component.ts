import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { Proveedor, ProveedorCorreo, Servicio } from '../../../models/interfaces';
import { ServiciosService } from '../../../services/servicios.service';
import { ProveedoresService } from '../../../services/proveedores.service';

interface CorreoForm {
  correo: string;
  principal: boolean;
}

@Component({
  selector: 'app-proveedor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? (i18n.language() === 'fr' ? 'Modifier le fournisseur' : 'Editar proveedor') : (i18n.language() === 'fr' ? 'Nouveau fournisseur' : 'Nuevo proveedor')"
      [loading]="loading"
      [canSave]="isFormValid()"
      size="lg"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <form class="form-grid">
        <!-- Nombre -->
        <div class="form-group full-width">
          <label class="form-label required">{{ i18n.t('suppliers.name') }}</label>
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="form.nombre" 
            name="nombre"
            [placeholder]="i18n.language() === 'fr' ? 'Nom du fournisseur' : 'Nombre del proveedor'"
          >
        </div>

        <!-- Servicio -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('suppliers.service') }}</label>
          <select class="form-control" [(ngModel)]="form.servicioId" name="servicioId">
            <option [ngValue]="null">{{ i18n.language() === 'fr' ? 'Sélectionner un service' : 'Seleccionar un servicio' }}</option>
            @for (servicio of servicios; track servicio.id) {
              <option [ngValue]="servicio.id">{{ servicio.nombre }}</option>
            }
          </select>
        </div>

        <!-- Lenguaje -->
        <div class="form-group">
          <label class="form-label">{{ i18n.t('suppliers.language') }}</label>
          <select class="form-control" [(ngModel)]="form.lenguaje" name="lenguaje">
            <option value="">{{ i18n.language() === 'fr' ? 'Sélectionner' : 'Seleccionar' }}</option>
            <option value="Français">Français</option>
            <option value="English">English</option>
            <option value="Español">Español</option>
            <option value="Français/English">Français/English</option>
          </select>
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label class="form-label">{{ i18n.t('suppliers.phone') }}</label>
          <input 
            type="tel" 
            class="form-control" 
            [(ngModel)]="form.telefono" 
            name="telefono"
            placeholder="+1 514 555-0000"
          >
        </div>

        <!-- Descripción -->
        <div class="form-group full-width">
          <label class="form-label">{{ i18n.language() === 'fr' ? 'Description' : 'Descripción' }}</label>
          <textarea 
            class="form-control" 
            [(ngModel)]="form.descripcion" 
            name="descripcion"
            rows="2"
          ></textarea>
        </div>

        <!-- Correos (máximo 4) -->
        <div class="form-group full-width">
          <label class="form-label">{{ i18n.t('suppliers.emails') }} ({{ correos.length }}/4)</label>
          
          <div class="correos-list">
            @for (correo of correos; track $index; let i = $index) {
              <div class="correo-row">
                <input 
                  type="email" 
                  class="form-control" 
                  [(ngModel)]="correo.correo" 
                  [name]="'correo_' + i"
                  placeholder="email@example.com"
                >
                <label class="checkbox-label">
                  <input 
                    type="radio" 
                    name="principal" 
                    [checked]="correo.principal"
                    (change)="setPrincipal(i)"
                  >
                  {{ i18n.language() === 'fr' ? 'Principal' : 'Principal' }}
                </label>
                <button type="button" class="btn btn-icon btn-danger-text" (click)="removeCorreo(i)">🗑️</button>
              </div>
            }
          </div>

          @if (correos.length < 4) {
            <button type="button" class="btn btn-secondary btn-sm mt-2" (click)="addCorreo()">
              ➕ {{ i18n.language() === 'fr' ? 'Ajouter un courriel' : 'Agregar correo' }}
            </button>
          }
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

    .correos-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .correo-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      .form-control { flex: 1; }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
      white-space: nowrap;

      input { cursor: pointer; }
    }

    .btn-danger-text {
      color: #dc3545;
      background: transparent;
      border: none;
      padding: 4px;

      &:hover { background: #fee2e2; }
    }

    .mt-2 { margin-top: var(--spacing-sm); }
  `]
})
export class ProveedorModalComponent implements OnInit, OnChanges {
  i18n = inject(I18nService);
  private serviciosService = inject(ServiciosService);
  private proveedoresService = inject(ProveedoresService);

  @Input() isOpen = false;
  @Input() proveedor?: Proveedor;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Proveedor>();

  loading = false;
  servicios: Servicio[] = [];

  form = {
    nombre: '',
    servicioId: null as number | null,
    lenguaje: '',
    telefono: '',
    descripcion: '',
    activo: true
  };

  correos: CorreoForm[] = [{ correo: '', principal: true }];

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.serviciosService.getServicios().subscribe({
      next: (servicios) => this.servicios = servicios,
      error: (err) => console.error('Error cargando servicios:', err)
    });
  }

  get isEdit(): boolean {
    return !!this.proveedor;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      // Reinicializar el formulario cuando se abre el modal
      if (this.proveedor) {
        this.form = {
          nombre: this.proveedor.nombre,
          servicioId: this.proveedor.servicioId,
          lenguaje: this.proveedor.lenguaje || '',
          telefono: this.proveedor.telefono || '',
          descripcion: this.proveedor.descripcion || '',
          activo: this.proveedor.activo
        };
        this.correos = this.proveedor.correos?.map(c => ({
          correo: c.correo,
          principal: c.principal
        })) || [{ correo: '', principal: true }];
      } else {
        this.resetForm();
      }
    }
  }


  isFormValid(): boolean {
    return !!(this.form.nombre.trim() && this.form.servicioId);
  }

  addCorreo(): void {
    if (this.correos.length < 4) {
      this.correos.push({ correo: '', principal: false });
    }
  }

  removeCorreo(index: number): void {
    const wasPrincipal = this.correos[index].principal;
    this.correos.splice(index, 1);
    if (wasPrincipal && this.correos.length > 0) {
      this.correos[0].principal = true;
    }
  }

  setPrincipal(index: number): void {
    this.correos.forEach((c, i) => c.principal = i === index);
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onSave(): void {
    if (!this.isFormValid()) return;

    this.loading = true;

    // Nota: El backend espera correos por separado o dentro del objeto? 
    // DOCUMENTACION_ENDPOINTS.md no muestra correos en el POST /proveedores inicial.
    // Pero asumiremos que el backend los manejará o los ignorará si no están listos.
    const proveedorData: any = {
      nombre: this.form.nombre,
      servicio_id: this.form.servicioId!,
      lenguaje: this.form.lenguaje || null,
      telefono: this.form.telefono || null,
      descripcion: this.form.descripcion || null
    };

    // Si el backend tuviera endpoint de update, lo usaríamos. 
    // Por ahora DOCUMENTACION_ENDPOINTS.md solo tiene create.
    // Usaremos createProveedor para ambos casos como fallback si no hay PUT definido.
    this.proveedoresService.createProveedor(proveedorData).subscribe({
      next: (res) => {
        this.loading = false;
        this.saved.emit(res);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error guardando proveedor:', err);
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.form = { nombre: '', servicioId: null, lenguaje: '', telefono: '', descripcion: '', activo: true };
    this.correos = [{ correo: '', principal: true }];
  }
}
