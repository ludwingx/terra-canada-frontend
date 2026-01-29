import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { Usuario, Rol, RolUsuario } from '../../../models/interfaces';
import { RolesService } from '../../../services/roles.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="isEdit ? (i18n.language() === 'fr' ? 'Modifier l\\'utilisateur' : 'Editar usuario') : (i18n.language() === 'fr' ? 'Nouvel utilisateur' : 'Nuevo usuario')"
      [loading]="loading"
      [canSave]="isFormValid()"
      size="md"
      (closed)="onClose()"
      (saved)="onSave()"
    >
      <form class="form-stack">
        <!-- Nombre de usuario -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('users.username') }}</label>
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="form.nombreUsuario" 
            name="nombreUsuario"
            placeholder="usuario123"
            [disabled]="isEdit"
          >
          @if (!isEdit) {
            <small class="form-hint">{{ i18n.language() === 'fr' ? 'Ne peut pas être modifié après création' : 'No se puede modificar después de crear' }}</small>
          }
        </div>

        <!-- Nombre completo -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('users.fullname') }}</label>
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="form.nombreCompleto" 
            name="nombreCompleto"
            [placeholder]="i18n.language() === 'fr' ? 'Prénom Nom' : 'Nombre Apellido'"
          >
        </div>

        <!-- Correo electrónico -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('users.email') }}</label>
          <input 
            type="email" 
            class="form-control" 
            [(ngModel)]="form.correo" 
            name="correo"
            placeholder="usuario@terracanada.ca"
          >
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

        <!-- Rol -->
        <div class="form-group">
          <label class="form-label required">{{ i18n.t('users.role') }}</label>
          <div class="role-cards">
            @for (rol of roles; track rol.id) {
              <label class="role-card" [class.selected]="form.rolId === rol.id">
                <input 
                  type="radio" 
                  name="rolId" 
                  [value]="rol.id"
                  [(ngModel)]="form.rolId"
                >
                <span class="role-name">{{ rol.nombre }}</span>
                <span class="role-desc">{{ rol.descripcion }}</span>
              </label>
            }
          </div>
        </div>

        <!-- Contraseña (solo para nuevo usuario) -->
        @if (!isEdit) {
          <div class="form-group">
            <label class="form-label required">{{ i18n.language() === 'fr' ? 'Mot de passe' : 'Contraseña' }}</label>
            <input 
              type="password" 
              class="form-control" 
              [(ngModel)]="form.password" 
              name="password"
              [placeholder]="i18n.language() === 'fr' ? 'Minimum 8 caractères' : 'Mínimo 8 caracteres'"
            >
          </div>
        }

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

    .form-hint {
      font-size: 11px;
      color: var(--text-muted);
    }

    .role-cards {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .role-card {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);

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

    .role-name {
      font-weight: 600;
      font-size: 13px;
      color: var(--text-primary);
    }

    .role-desc {
      font-size: 11px;
      color: var(--text-muted);
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
export class UsuarioModalComponent implements OnInit, OnChanges {
  i18n = inject(I18nService);
  private rolesService = inject(RolesService);
  private usuariosService = inject(UsuariosService);

  @Input() isOpen = false;
  @Input() usuario?: Usuario;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Usuario>();

  loading = false;
  roles: Rol[] = [];

  form = {
    nombreUsuario: '',
    nombreCompleto: '',
    correo: '',
    telefono: '',
    rolId: 3 as number,
    password: '',
    activo: true
  };

  get isEdit(): boolean {
    return !!this.usuario;
  }

  ngOnInit(): void {
    this.loadRoles();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] || (changes['isOpen'] && this.isOpen)) {
      this.initForm();
    }
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => console.error('Error cargando roles:', err)
    });
  }

  private initForm(): void {
    if (this.usuario) {
      this.form = {
        nombreUsuario: this.usuario.nombreUsuario,
        nombreCompleto: this.usuario.nombreCompleto,
        correo: this.usuario.correo,
        telefono: this.usuario.telefono || '',
        rolId: this.usuario.rolId,
        password: '',
        activo: this.usuario.activo
      };
    } else {
      this.resetForm();
    }
  }

  isFormValid(): boolean {
    const hasPassword = this.isEdit || this.form.password.length >= 8;
    return !!(
      this.form.nombreUsuario.trim() && 
      this.form.nombreCompleto.trim() &&
      this.form.correo.includes('@') &&
      this.form.rolId &&
      hasPassword
    );
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onSave(): void {
    if (!this.isFormValid()) return;

    this.loading = true;

    const usuarioData: any = {
      nombre_usuario: this.form.nombreUsuario,
      nombre_completo: this.form.nombreCompleto,
      correo: this.form.correo,
      telefono: this.form.telefono || null,
      rol_id: this.form.rolId,
      activo: this.form.activo
    };

    if (!this.isEdit) {
      usuarioData.password = this.form.password;
    }

    const action = this.isEdit 
      ? this.usuariosService.updateUsuario(this.usuario!.id, usuarioData)
      : this.usuariosService.createUsuario(usuarioData);

    action.subscribe({
      next: (res) => {
        this.loading = false;
        this.saved.emit(res);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error guardando usuario:', err);
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.form = {
      nombreUsuario: '',
      nombreCompleto: '',
      correo: '',
      telefono: '',
      rolId: 3,
      password: '',
      activo: true
    };
  }
}
