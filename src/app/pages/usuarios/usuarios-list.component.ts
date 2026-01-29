import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { Usuario } from '../../models/interfaces';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="usuarios-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('users.title') }}</h1>
          <p class="header-subtitle">{{ usuarios.length }} {{ i18n.language() === 'fr' ? 'utilisateurs' : 'usuarios' }}</p>
        </div>
        <button class="btn btn-primary">
          <span>➕</span>
          {{ i18n.t('users.new') }}
        </button>
      </div>

      <div class="card">
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
              @for (user of usuarios; track user.id) {
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
                      {{ user.rol?.nombre }}
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
                    <button class="btn btn-secondary btn-sm">{{ i18n.t('actions.edit') }}</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
export class UsuariosListComponent {
  i18n = inject(I18nService);

  usuarios: Usuario[] = [
    { id: 1, nombreUsuario: 'admin', correo: 'admin@terracanada.ca', nombreCompleto: 'Jean Dupont', rolId: 1, rol: { id: 1, nombre: 'ADMIN', fechaCreacion: new Date() }, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 2, nombreUsuario: 'supervisor1', correo: 'marie.tremblay@terracanada.ca', nombreCompleto: 'Marie Tremblay', rolId: 2, rol: { id: 2, nombre: 'SUPERVISOR', fechaCreacion: new Date() }, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 3, nombreUsuario: 'equipo1', correo: 'pierre.gagnon@terracanada.ca', nombreCompleto: 'Pierre Gagnon', rolId: 3, rol: { id: 3, nombre: 'EQUIPO', fechaCreacion: new Date() }, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 4, nombreUsuario: 'equipo2', correo: 'sophie.roy@terracanada.ca', nombreCompleto: 'Sophie Roy', rolId: 3, rol: { id: 3, nombre: 'EQUIPO', fechaCreacion: new Date() }, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }
  ];

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
