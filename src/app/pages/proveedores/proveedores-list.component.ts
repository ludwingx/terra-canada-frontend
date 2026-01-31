import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';
import { Proveedor } from '../../models/interfaces';
import { ProveedorModalComponent } from '../../components/modals/proveedor-modal/proveedor-modal.component';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-proveedores-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProveedorModalComponent],
  template: `
    <div class="proveedores-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('suppliers.title') }}</h1>
          <p class="header-subtitle">{{ proveedores().length }} {{ i18n.t('suppliers.count') }}</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span>➕</span>
          {{ i18n.t('suppliers.new') }}
        </button>
      </div>

      <!-- Search -->
      <div class="card mb-3">
        <div class="filters-row">
          <div class="filter-group flex-grow">
            <input 
              type="text" 
              class="form-control" 
              [placeholder]="i18n.t('actions.search') + '...'"
              [(ngModel)]="searchQuery"
            >
          </div>
          <div class="filter-group">
            <select class="form-control" [(ngModel)]="filterService">
              <option value="">{{ i18n.t('filter.all_services') }}</option>
              <option value="Assurance">Assurance</option>
              <option value="Hotels">Hotels</option>
              <option value="Excursion">Excursion</option>
              <option value="Car rental">Car rental</option>
              <option value="Guides">Guides</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Suppliers Grid -->
      <div class="suppliers-container relative">
        @if (loading()) {
          <div class="loading-overlay">
            <div class="spinner"></div>
            <p>{{ i18n.t('msg.loading') }}</p>
          </div>
        }

        <div class="suppliers-grid">
          @for (proveedor of filteredProveedores(); track proveedor.id) {
            <div class="supplier-card card">
              <div class="supplier-header">
                <div class="supplier-avatar">
                  {{ getInitials(proveedor.nombre) }}
                </div>
                <div class="supplier-info">
                  <h3>{{ proveedor.nombre }}</h3>
                  <span class="badge badge-paid">{{ proveedor.servicio?.nombre }}</span>
                </div>
                <div class="supplier-status" [class.active]="proveedor.activo">
                  {{ proveedor.activo ? '●' : '○' }}
                </div>
              </div>
              
              <div class="supplier-details">
                @if (proveedor.lenguaje) {
                  <div class="detail-row">
                    <span class="detail-label">🌐 {{ i18n.t('suppliers.language') }}</span>
                    <span class="detail-value">{{ proveedor.lenguaje }}</span>
                  </div>
                }
                @if (proveedor.telefono) {
                  <div class="detail-row">
                    <span class="detail-label">📞 {{ i18n.t('suppliers.phone') }}</span>
                    <span class="detail-value">{{ proveedor.telefono }}</span>
                  </div>
                }
                <div class="detail-row">
                  <span class="detail-label">✉️ {{ i18n.t('suppliers.emails') }}</span>
                  <span class="detail-value">{{ proveedor.correos?.length || 0 }}/4</span>
                </div>
              </div>

              @if (proveedor.correos && proveedor.correos.length > 0) {
                <div class="supplier-emails">
                  @for (correo of proveedor.correos; track correo.id) {
                    <div class="email-chip" [class.principal]="correo.principal">
                      {{ correo.correo }}
                      @if (correo.principal) {
                        <span class="principal-badge">★</span>
                      }
                    </div>
                  }
                </div>
              }

              <div class="supplier-actions">
                <button class="btn btn-secondary btn-sm" (click)="openEditModal(proveedor)">{{ i18n.t('actions.view') }}</button>
                <button class="btn btn-primary btn-sm" (click)="openEditModal(proveedor)">{{ i18n.t('actions.edit') }}</button>
              </div>
            </div>
          } @empty {
            @if (!loading()) {
              <div class="no-data card">
                <p class="text-muted text-center">{{ i18n.t('msg.no_data') }}</p>
              </div>
            }
          }
        </div>
      </div>

      <!-- Modal Proveedor -->
      <app-proveedor-modal
        [isOpen]="isModalOpen"
        [proveedor]="selectedProveedor"
        (closed)="closeModal()"
        (saved)="onProveedorSaved($event)"
      />
    </div>
  `,
  styles: [`
    .proveedores-page {
      position: relative;
    }
    .suppliers-container {
      position: relative;
      min-height: 200px;
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

    .flex-grow {
      flex: 1;
    }

    .suppliers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-lg);
    }

    .supplier-card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .supplier-header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .supplier-avatar {
      width: 50px;
      height: 50px;
      border-radius: var(--border-radius);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }

    .supplier-info {
      flex: 1;

      h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 4px;
        color: var(--text-primary);
      }
    }

    .supplier-status {
      font-size: 12px;
      color: var(--text-muted);

      &.active {
        color: #28a745;
      }
    }

    .supplier-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }

    .detail-label {
      color: var(--text-muted);
    }

    .detail-value {
      color: var(--text-primary);
      font-weight: 500;
    }

    .supplier-emails {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
    }

    .email-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--bg-hover);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      color: var(--text-secondary);

      &.principal {
        background: rgba(45, 122, 122, 0.1);
        color: var(--primary-color);
      }
    }

    .principal-badge {
      color: #ffc107;
    }

    .supplier-actions {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: auto;
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }

    .no-data {
      grid-column: 1 / -1;
      padding: var(--spacing-xl);
    }
  `]
})
export class ProveedoresListComponent implements OnInit {
  i18n = inject(I18nService);
  private proveedoresService = inject(ProveedoresService);
  
  searchQuery = '';
  filterService = '';
  
  loading = signal(false);
  proveedores = signal<Proveedor[]>([]);

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.loading.set(true);
    this.proveedoresService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando proveedores:', err);
        this.loading.set(false);
      }
    });
  }

  filteredProveedores = computed(() => {
    const query = this.searchQuery.toLowerCase();
    const service = this.filterService;
    
    return this.proveedores().filter(p => {
      const matchesSearch = !query || 
        p.nombre.toLowerCase().includes(query);
      
      const matchesService = !service || 
        p.servicio?.nombre === service;
      
      return matchesSearch && matchesService;
    });
  });

  getInitials(name?: string | null): string {
    const safe = String(name || '').trim();
    if (!safe) return 'PR';
    return safe
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  // Modal handling
  isModalOpen = false;
  selectedProveedor?: Proveedor;

  openCreateModal(): void {
    this.selectedProveedor = undefined;
    this.isModalOpen = true;
  }

  openEditModal(proveedor: Proveedor): void {
    this.selectedProveedor = proveedor;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProveedor = undefined;
  }

  onProveedorSaved(proveedor: Proveedor): void {
    this.loadProveedores();
    this.closeModal();
  }
}
