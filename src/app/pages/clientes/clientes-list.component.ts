import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';
import { Cliente } from '../../models/interfaces';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="clientes-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('clients.title') }}</h1>
          <p class="header-subtitle">{{ clientes.length }} {{ i18n.language() === 'fr' ? 'clients enregistrés' : 'clientes registrados' }}</p>
        </div>
        <button class="btn btn-primary">
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
      <div class="card">
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
              @for (cliente of filteredClientes; track cliente.id) {
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
                      <button class="btn btn-secondary btn-sm">{{ i18n.t('actions.edit') }}</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center text-muted">
                    {{ i18n.t('msg.no_data') }}
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
export class ClientesListComponent {
  i18n = inject(I18nService);
  searchQuery = '';

  clientes: Cliente[] = [
    { id: 1, nombre: 'Hôtel Le Germain', ubicacion: 'Montréal, QC', telefono: '+1 514 555-1001', correo: 'reservations@legermain.com', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 2, nombre: 'Fairmont Château Frontenac', ubicacion: 'Québec City, QC', telefono: '+1 418 555-2002', correo: 'info@frontenac.com', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 3, nombre: 'Delta Hotels by Marriott', ubicacion: 'Toronto, ON', correo: 'groups@deltahotels.com', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 4, nombre: 'Auberge Saint-Antoine', ubicacion: 'Québec City, QC', telefono: '+1 418 555-4004', correo: 'reservation@saint-antoine.com', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 5, nombre: 'Le Mount Stephen', ubicacion: 'Montréal, QC', correo: 'concierge@lemountstephen.com', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 6, nombre: 'Château Laurier', ubicacion: 'Ottawa, ON', telefono: '+1 613 555-6006', activo: false, fechaCreacion: new Date(), fechaActualizacion: new Date() }
  ];

  get filteredClientes(): Cliente[] {
    if (!this.searchQuery) return this.clientes;
    return this.clientes.filter(c => 
      c.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      c.ubicacion?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
