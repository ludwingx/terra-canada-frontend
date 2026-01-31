import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';
import { Cliente } from '../../models/interfaces';
import { ClienteModalComponent } from '../../components/modals/cliente-modal/cliente-modal.component';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteModalComponent],
  template: `
    <div class="clientes-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('clients.title') }}</h1>
          <p class="header-subtitle">{{ clientes().length }} {{ i18n.t('clients.count') }}</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span>➕</span>
          {{ i18n.t('clients.new') }}
        </button>
      </div>

      <!-- Search -->
      <div class="card mb-3">
        <div class="filters-row">
          <input 
            type="text" 
            class="form-control" 
            [placeholder]="i18n.t('actions.search') + '...'"
            [(ngModel)]="searchQuery"
            style="max-width: 400px;"
          >
        </div>
      </div>

      <!-- Clients Table -->
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
                <th>{{ i18n.t('clients.name') }}</th>
                <th>{{ i18n.t('clients.location') }}</th>
                <th>{{ i18n.t('clients.email') }}</th>
                <th>{{ i18n.t('suppliers.phone') }}</th>
                <th>{{ i18n.t('payments.status') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (cliente of filteredClientes(); track cliente.id) {
                <tr>
                  <td>
                    <div class="client-name">
                      <span class="client-icon">🏨</span>
                      <strong>{{ cliente.nombre }}</strong>
                    </div>
                  </td>
                  <td>{{ cliente.ubicacion || '-' }}</td>
                  <td>
                    @if (cliente.correo) {
                      <a class="text-primary">{{ cliente.correo }}</a>
                    } @else {
                      <span class="text-muted">-</span>
                    }
                  </td>
                  <td>{{ cliente.telefono || '-' }}</td>
                  <td>
                    @if (cliente.activo) {
                      <span class="badge badge-paid">{{ i18n.t('status.active') }}</span>
                    } @else {
                      <span class="badge badge-inactive">{{ i18n.t('status.inactive') }}</span>
                    }
                  </td>
                  <td>
                    <div class="actions-cell">
                      <button class="btn btn-icon btn-sm" title="{{ i18n.t('actions.view') }}" (click)="openEditModal(cliente)">👁️</button>
                      <button class="btn btn-secondary btn-sm" (click)="openEditModal(cliente)">{{ i18n.t('actions.edit') }}</button>
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

      <app-cliente-modal
        [isOpen]="isModalOpen"
        [cliente]="selectedCliente"
        (closed)="closeModal()"
        (saved)="onClienteSaved($event)"
      />
    </div>
  `,
  styles: [`
    .clientes-page {
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

    .client-name {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .client-icon {
      font-size: 18px;
    }

    .actions-cell {
      display: flex;
      gap: var(--spacing-sm);
    }
  `]
})
export class ClientesListComponent implements OnInit {
  i18n = inject(I18nService);
  private clientesService = inject(ClientesService);
  
  searchQuery = signal('');
  loading = signal(false);
  clientes = signal<Cliente[]>([]);

  // Modal handling
  isModalOpen = false;
  selectedCliente?: Cliente;

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading.set(true);
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando clientes:', err);
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.selectedCliente = undefined;
    this.isModalOpen = true;
  }

  openEditModal(cliente: Cliente): void {
    this.selectedCliente = cliente;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCliente = undefined;
  }

  onClienteSaved(cliente: Cliente): void {
    this.loadClientes();
    this.closeModal();
  }

  filteredClientes = computed(() => {
    const list = this.clientes();
    const query = this.searchQuery().toLowerCase();
    if (!query) return list;
    return list.filter(c => 
      c.nombre.toLowerCase().includes(query) ||
      c.ubicacion?.toLowerCase().includes(query)
    );
  });
}
