import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';
import { Evento } from '../../models/interfaces';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auditoria-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('audit.title') }}</h1>
          <p class="header-subtitle">{{ eventos.length }} {{ i18n.language() === 'fr' ? 'événements enregistrés' : 'eventos registrados' }}</p>
        </div>
        <button class="btn btn-secondary">
          <span>📥</span>
          {{ i18n.t('actions.export') }}
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-3">
        <div class="filters-row">
          <select class="form-control" [(ngModel)]="filterType" style="max-width: 200px;">
            <option value="">{{ i18n.language() === 'fr' ? 'Tous les types' : 'Todos los tipos' }}</option>
            <option value="INICIO_SESION">{{ i18n.language() === 'fr' ? 'Connexion' : 'Inicio sesión' }}</option>
            <option value="CREAR">{{ i18n.language() === 'fr' ? 'Création' : 'Creación' }}</option>
            <option value="ACTUALIZAR">{{ i18n.language() === 'fr' ? 'Mise à jour' : 'Actualización' }}</option>
            <option value="ELIMINAR">{{ i18n.language() === 'fr' ? 'Suppression' : 'Eliminación' }}</option>
            <option value="VERIFICAR_PAGO">{{ i18n.language() === 'fr' ? 'Vérification' : 'Verificación' }}</option>
            <option value="ENVIAR_CORREO">{{ i18n.language() === 'fr' ? 'Envoi courriel' : 'Envío correo' }}</option>
          </select>
          <input type="date" class="form-control" [(ngModel)]="filterDate" style="max-width: 180px;">
        </div>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('audit.date') }}</th>
                <th>{{ i18n.t('audit.user') }}</th>
                <th>{{ i18n.t('audit.event') }}</th>
                <th>{{ i18n.t('audit.entity') }}</th>
                <th>{{ i18n.t('audit.description') }}</th>
                <th>{{ i18n.t('audit.ip') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (evento of filteredEventos; track evento.id) {
                <tr>
                  <td class="text-muted">{{ formatDateTime(evento.fechaEvento) }}</td>
                  <td>{{ evento.usuario?.nombreCompleto || 'Sistema' }}</td>
                  <td>
                    <span class="event-badge" [class]="'type-' + evento.tipoEvento.toLowerCase()">
                      {{ getEventIcon(evento.tipoEvento) }} {{ getEventLabel(evento.tipoEvento) }}
                    </span>
                  </td>
                  <td>{{ evento.entidadTipo }} #{{ evento.entidadId }}</td>
                  <td>{{ evento.descripcion }}</td>
                  <td><code>{{ evento.ipOrigen || '-' }}</code></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filters-row {
      display: flex;
      gap: var(--spacing-md);
    }
    .event-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;

      &.type-inicio_sesion { background: #dbeafe; color: #1e40af; }
      &.type-crear { background: #d1fae5; color: #065f46; }
      &.type-actualizar { background: #fef3c7; color: #92400e; }
      &.type-eliminar { background: #fee2e2; color: #991b1b; }
      &.type-verificar_pago { background: #e0e7ff; color: #3730a3; }
      &.type-enviar_correo { background: #fce7f3; color: #9d174d; }
    }
    code {
      background: var(--bg-hover);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }
  `]
})
export class AuditoriaListComponent {
  i18n = inject(I18nService);
  filterType = '';
  filterDate = '';

  eventos: Evento[] = [
    { id: 1, usuarioId: 1, usuario: { id: 1, nombreUsuario: 'admin', correo: 'a@a.com', nombreCompleto: 'Jean Dupont', rolId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, tipoEvento: 'CREAR', entidadTipo: 'Pago', entidadId: 6, descripcion: 'Pago RES-2026-006 creado', ipOrigen: '192.168.1.100', fechaEvento: new Date() },
    { id: 2, usuarioId: 1, usuario: { id: 1, nombreUsuario: 'admin', correo: 'a@a.com', nombreCompleto: 'Jean Dupont', rolId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, tipoEvento: 'VERIFICAR_PAGO', entidadTipo: 'Pago', entidadId: 4, descripcion: 'Pago RES-2026-004 verificado por documento banco', ipOrigen: '192.168.1.100', fechaEvento: new Date('2026-01-28T10:30:00') },
    { id: 3, usuarioId: 2, usuario: { id: 2, nombreUsuario: 'supervisor1', correo: 's@a.com', nombreCompleto: 'Marie Tremblay', rolId: 2, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, tipoEvento: 'ENVIAR_CORREO', entidadTipo: 'EnvioCorreo', entidadId: 3, descripcion: 'Correo enviado a Assurance Plus', ipOrigen: '192.168.1.101', fechaEvento: new Date('2026-01-28T09:15:00') },
    { id: 4, usuarioId: 1, usuario: { id: 1, nombreUsuario: 'admin', correo: 'a@a.com', nombreCompleto: 'Jean Dupont', rolId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, tipoEvento: 'INICIO_SESION', entidadTipo: 'Usuario', entidadId: 1, descripcion: 'Inicio de sesión exitoso', ipOrigen: '192.168.1.100', fechaEvento: new Date('2026-01-28T08:00:00') },
    { id: 5, usuarioId: 1, usuario: { id: 1, nombreUsuario: 'admin', correo: 'a@a.com', nombreCompleto: 'Jean Dupont', rolId: 1, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, tipoEvento: 'ACTUALIZAR', entidadTipo: 'Proveedor', entidadId: 1, descripcion: 'Proveedor Voyage Excellence actualizado', ipOrigen: '192.168.1.100', fechaEvento: new Date('2026-01-27T16:45:00') }
  ];

  get filteredEventos(): Evento[] {
    return this.eventos.filter(e => !this.filterType || e.tipoEvento === this.filterType);
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES');
  }

  getEventIcon(type: string): string {
    const icons: Record<string, string> = { INICIO_SESION: '🔐', CREAR: '➕', ACTUALIZAR: '✏️', ELIMINAR: '🗑️', VERIFICAR_PAGO: '✅', ENVIAR_CORREO: '✉️', SUBIR_DOCUMENTO: '📤', CARGAR_TARJETA: '💳', RESET_MENSUAL: '🔄' };
    return icons[type] || '📋';
  }

  getEventLabel(type: string): string {
    const labels: Record<string, { fr: string; es: string }> = {
      INICIO_SESION: { fr: 'Connexion', es: 'Inicio sesión' },
      CREAR: { fr: 'Création', es: 'Creación' },
      ACTUALIZAR: { fr: 'Mise à jour', es: 'Actualización' },
      ELIMINAR: { fr: 'Suppression', es: 'Eliminación' },
      VERIFICAR_PAGO: { fr: 'Vérification', es: 'Verificación' },
      ENVIAR_CORREO: { fr: 'Envoi', es: 'Envío' }
    };
    return labels[type]?.[this.i18n.language()] || type;
  }
}
