import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { Usuario } from '../../models/interfaces';
import { UsuarioModalComponent } from '../../components/modals/usuario-modal/usuario-modal.component';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, UsuarioModalComponent],
  template: `
    <div class="usuarios-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('users.title') }}</h1>
          <p class="header-subtitle">{{ usuarios().length }} {{ i18n.t('users.count') }}</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span>➕</span>
          {{ i18n.t('users.new') }}
        </button>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="loading-overlay">
            <div class="spinner"></div>
            <p>{{ i18n.t('msg.loading') }}</p>
          </div>
        }

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('users.username') }}</th>
                <th>{{ i18n.t('users.fullname') }}</th>
                <th>{{ i18n.t('users.email') }}</th>
                <th>{{ i18n.t('users.role') }}</th>
                <th>{{ i18n.t('payments.status') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (user of usuarios(); track user.id) {
                <tr>
                  <td>
                    <div class="user-cell">
                      <span class="user-avatar">{{ getInitials(user.nombreCompleto) }}</span>
                      <strong>{{ user.nombreUsuario }}</strong>
                    </div>
                  </td>
                  <td>{{ user.nombreCompleto }}</td>
                  <td>{{ user.correo }}</td>
                  <td>
                    <span class="role-badge" [class]="'role-' + user.rol?.nombre?.toLowerCase()">
                      {{ i18n.t('role.' + (user.rol?.nombre?.toLowerCase() || 'equipo')) }}
                    </span>
                  </td>
                  <td>
                    @if (user.activo) {
                      <span class="badge badge-paid">{{ i18n.t('status.active') }}</span>
                    } @else {
                      <span class="badge badge-inactive">{{ i18n.t('status.inactive') }}</span>
                    }
                  </td>
                   <td>
                    <div class="actions-cell">
                      <button class="btn btn-icon btn-sm" title="{{ i18n.t('actions.view') }}" (click)="openViewModal(user)">👁️</button>
                      <button class="btn btn-icon btn-sm" (click)="openEditModal(user)">✏️</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                @if (!loading()) {
                  <tr>
                    <td colspan="6" class="text-center text-muted">
                      {{ i18n.t('msg.no_data') }}
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <app-usuario-modal
        [isOpen]="isModalOpen"
        [usuario]="selectedUsuario"
        [viewOnly]="isViewOnly"
        (closed)="closeModal()"
        (saved)="onUsuarioSaved($event)"
      />
    </div>
  `,
  styles: [`
    .usuarios-page {
      position: relative;
    }
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      border-radius: var(--border-radius);
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--spacing-sm);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .user-cell {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
    }
    .role-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;

      &.role-admin { background: #fee2e2; color: #991b1b; }
      &.role-supervisor { background: #fef3c7; color: #92400e; }
      &.role-equipo { background: #dbeafe; color: #1e40af; }
    }
  `]
})
export class UsuariosListComponent implements OnInit {
  i18n = inject(I18nService);
  private usuariosService = inject(UsuariosService);
  
  loading = signal(false);
  usuarios = signal<Usuario[]>([]);

  // Modal handling
  isModalOpen = false;
  isViewOnly = false;
  selectedUsuario?: Usuario;

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.usuariosService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isViewOnly = false;
    this.selectedUsuario = undefined;
    this.isModalOpen = true;
  }

  openEditModal(usuario: Usuario): void {
    this.isViewOnly = false;
    this.selectedUsuario = usuario;
    this.isModalOpen = true;
  }

  openViewModal(usuario: Usuario): void {
    this.isViewOnly = true;
    this.selectedUsuario = usuario;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUsuario = undefined;
  }

  onUsuarioSaved(usuario: Usuario): void {
    this.loadUsuarios();
    this.closeModal();
  }

  getInitials(name?: string | null): string {
    const safe = String(name || '').trim();
    if (!safe) return 'US';
    return safe
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
