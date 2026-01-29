import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';
import { Evento } from '../../models/interfaces';
import { ModalComponent } from '../../components/shared/modal/modal.component';
import { AuditoriaService } from '../../services/auditoria.service';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
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
                <th>{{ i18n.t('payments.actions') }}</th>
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
                  <td>
                    <button class="btn btn-secondary btn-sm" (click)="openViewModal(evento)">
                      👁️ {{ i18n.t('actions.view') }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <app-modal
        [isOpen]="isModalOpen"
        [title]="i18n.language() === 'fr' ? 'Détail de l\\'événement' : 'Detalle del evento'"
        [showFooter]="false"
        size="md"
        (closed)="closeModal()"
      >
        @if (selectedEvento) {
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('audit.date') }}</span>
              <span class="detail-value">{{ formatDateTime(selectedEvento.fechaEvento) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('audit.user') }}</span>
              <span class="detail-value">{{ selectedEvento.usuario?.nombreCompleto || 'Sistema' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('audit.event') }}</span>
              <span class="detail-value">{{ getEventLabel(selectedEvento.tipoEvento) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('audit.entity') }}</span>
              <span class="detail-value">{{ selectedEvento.entidadTipo }} #{{ selectedEvento.entidadId }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('audit.description') }}</span>
              <span class="detail-value">{{ selectedEvento.descripcion }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ i18n.t('audit.ip') }}</span>
              <span class="detail-value"><code>{{ selectedEvento.ipOrigen || '-' }}</code></span>
            </div>
          </div>
        }
      </app-modal>
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

    .detail-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .detail-row {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: var(--spacing-md);
      align-items: start;
    }

    .detail-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .detail-value {
      font-size: 13px;
      color: var(--text-primary);
      word-break: break-word;
    }
  `]
})
export class AuditoriaListComponent implements OnInit {
  i18n = inject(I18nService);
  private auditoriaService = inject(AuditoriaService);
  
  filterType = '';
  filterDate = '';
  loading = false;

  isModalOpen = false;
  selectedEvento?: Evento;

  eventos: Evento[] = [];

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos(): void {
    this.loading = true;
    this.auditoriaService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando auditoría:', err);
        this.loading = false;
      }
    });
  }

  get filteredEventos(): Evento[] {
    return this.eventos.filter(e => !this.filterType || e.tipoEvento === this.filterType);
  }

  openViewModal(evento: Evento): void {
    this.selectedEvento = evento;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEvento = undefined;
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
