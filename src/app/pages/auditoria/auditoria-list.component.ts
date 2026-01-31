import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
          <p class="header-subtitle">{{ eventos().length }} {{ i18n.t('audit.entity') }}</p>
        </div>
        <button class="btn btn-secondary">
          <span>📥</span>
          {{ i18n.t('actions.export') }}
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-3">
        <div class="filters-row">
          <select class="form-control" [(ngModel)]="filterType" (ngModelChange)="onFilterChange()" style="max-width: 200px;">
            <option value="">{{ i18n.t('audit.all_types') }}</option>
            <option value="INICIO_SESION">{{ i18n.t('audit.type_login') }}</option>
            <option value="CREAR">{{ i18n.t('audit.type_create') }}</option>
            <option value="ACTUALIZAR">{{ i18n.t('audit.type_update') }}</option>
            <option value="ELIMINAR">{{ i18n.t('audit.type_delete') }}</option>
            <option value="VERIFICAR_PAGO">{{ i18n.t('audit.type_verify') }}</option>
            <option value="ENVIAR_CORREO">{{ i18n.t('audit.type_email') }}</option>
          </select>
          <input type="date" class="form-control" [(ngModel)]="filterDate" (ngModelChange)="onFilterChange()" style="max-width: 180px;">
        </div>
      </div>

      <div class="card relative">
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
              @for (evento of filteredEventos(); track evento.id) {
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
              } @empty {
                @if (!loading()) {
                  <tr>
                    <td colspan="7" class="text-center text-muted">{{ i18n.t('msg.no_data') }}</td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <app-modal
        [isOpen]="isModalOpen"
        [title]="i18n.t('audit.detail_title')"
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
    .auditoria-page {
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
  
  loading = signal(false);
  eventos = signal<Evento[]>([]);

  isModalOpen = false;
  selectedEvento?: Evento;

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos(): void {
    this.loading.set(true);
    this.auditoriaService.getEventos().subscribe({
      next: (data) => {
        this.eventos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando auditoría:', err);
        this.loading.set(false);
      }
    });
  }

  onFilterChange(): void {
    // Triggers computed re-evaluation through dependency tracking
  }

  filteredEventos = computed(() => {
    const list = this.eventos();
    const type = this.filterType;
    const date = this.filterDate;
    
    return list.filter(e => {
      const matchesType = !type || e.tipoEvento === type;
      const matchesDate = !date || new Date(e.fechaEvento).toISOString().split('T')[0] === date;
      return matchesType && matchesDate;
    });
  });

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
    const key = `audit.type_${type.toLowerCase().replace('verificar_pago', 'verify').replace('enviar_correo', 'email').replace('inicio_sesion', 'login').replace('crear', 'create').replace('actualizar', 'update').replace('eliminar', 'delete')}`;
    const label = this.i18n.t(key);
    return label !== key ? label : type;
  }
}
