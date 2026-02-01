import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { Cliente } from '../../../models/interfaces';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-cliente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? i18n.t('actions.edit_client') : i18n.t('actions.new_client')"
      [loading]="loading"
      [canSave]="isFormValid()"
      size="md"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <form class="form-stack">
        <!-- Nombre -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('clients.name') }}</label>
          <input
            type="text"
            class="form-control"
            [(ngModel)]="form.nombre"
            name="nombre"
            [placeholder]="i18n.t('clients.name_placeholder')"
          />
        </div>

        <!-- Ubicación -->
        <div class="form-group">
          <label class="form-label">{{ i18n.t('clients.location') }}</label>
          <input
            type="text"
            class="form-control"
            [(ngModel)]="form.ubicacion"
            name="ubicacion"
            [placeholder]="i18n.t('clients.location_placeholder')"
          />
        </div>

        <!-- Correo -->
        <div class="form-group">
          <label class="form-label">{{ i18n.t('clients.email') }}</label>
          <input
            type="email"
            class="form-control"
            [(ngModel)]="form.correo"
            name="correo"
            placeholder="email@hotel.com"
          />
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
          />
        </div>

        <!-- Estado activo -->
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="form.activo" name="activo" />
            {{ i18n.t('status.active') }}
          </label>
        </div>
      </form>
    </app-modal>
  `,
  styles: [
    `
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

        input {
          cursor: pointer;
        }
      }
    `,
  ],
})
export class ClienteModalComponent implements OnInit, OnChanges {
  i18n = inject(I18nService);
  private clientesService = inject(ClientesService);

  @Input() isOpen = false;
  @Input() cliente?: Cliente;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Cliente>();

  loading = false;

  form = {
    nombre: '',
    ubicacion: '',
    correo: '',
    telefono: '',
    activo: true,
  };

  get isEdit(): boolean {
    return !!this.cliente;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] || (changes['isOpen'] && this.isOpen)) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.cliente) {
      this.form = {
        nombre: this.cliente.nombre,
        ubicacion: this.cliente.ubicacion || '',
        correo: this.cliente.correo || '',
        telefono: this.cliente.telefono || '',
        activo: this.cliente.activo,
      };
    } else {
      this.resetForm();
    }
  }

  isFormValid(): boolean {
    return !!this.form.nombre.trim();
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onSave(): void {
    if (!this.isFormValid()) return;

    this.loading = true;

    const clienteData: any = {
      nombre: this.form.nombre,
      ubicacion: this.form.ubicacion || null,
      correo: this.form.correo || null,
      telefono: this.form.telefono || null,
    };

    const action = this.isEdit
      ? this.clientesService.updateCliente(this.cliente!.id, clienteData)
      : this.clientesService.createCliente(clienteData);

    action.subscribe({
      next: (res) => {
        this.loading = false;
        this.saved.emit(res);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error guardando cliente:', err);
        this.loading = false;
      },
    });
  }

  private resetForm(): void {
    this.form = { nombre: '', ubicacion: '', correo: '', telefono: '', activo: true };
  }
}
