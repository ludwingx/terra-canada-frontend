import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { CuentaBancaria } from '../../models/interfaces';
import { CuentaModalComponent } from '../../components/modals/cuenta-modal/cuenta-modal.component';
import { CuentasService } from '../../services/cuentas.service';

@Component({
  selector: 'app-cuentas-list',
  standalone: true,
  imports: [CommonModule, CuentaModalComponent],
  template: `
    <div class="cuentas-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('accounts.title') }}</h1>
          <p class="header-subtitle">{{ cuentas.length }} {{ i18n.language() === 'fr' ? 'comptes enregistrés' : 'cuentas registradas' }}</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span>➕</span>
          {{ i18n.t('accounts.new') }}
        </button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('accounts.bank') }}</th>
                <th>{{ i18n.t('accounts.name') }}</th>
                <th>{{ i18n.t('cards.last4') }}</th>
                <th>{{ i18n.t('payments.currency') }}</th>
                <th>{{ i18n.t('payments.status') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (cuenta of cuentas; track cuenta.id) {
                <tr>
                  <td>
                    <div class="bank-name">
                      <span class="bank-icon">🏦</span>
                      <strong>{{ cuenta.nombreBanco }}</strong>
                    </div>
                  </td>
                  <td>{{ cuenta.nombreCuenta }}</td>
                  <td><code>****{{ cuenta.ultimos4Digitos }}</code></td>
                  <td>
                    <span class="badge badge-paid">{{ cuenta.moneda }}</span>
                  </td>
                  <td>
                    @if (cuenta.activo) {
                      <span class="badge badge-paid">{{ i18n.t('status.active') }}</span>
                    } @else {
                      <span class="badge badge-inactive">{{ i18n.t('status.inactive') }}</span>
                    }
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" (click)="openEditModal(cuenta)">{{ i18n.t('actions.edit') }}</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <app-cuenta-modal
        [isOpen]="isModalOpen"
        [cuenta]="selectedCuenta"
        (closed)="closeModal()"
        (saved)="onCuentaSaved($event)"
      />
    </div>
  `,
  styles: [`
    .bank-name {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    .bank-icon { font-size: 20px; }
    code {
      background: var(--bg-hover);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
  `]
})
export class CuentasListComponent implements OnInit {
  i18n = inject(I18nService);
  private cuentasService = inject(CuentasService);
  
  loading = false;

  // Modal handling
  isModalOpen = false;
  selectedCuenta?: CuentaBancaria;

  cuentas: CuentaBancaria[] = [];

  ngOnInit(): void {
    this.loadCuentas();
  }

  loadCuentas(): void {
    this.loading = true;
    this.cuentasService.getCuentas().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando cuentas:', err);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.selectedCuenta = undefined;
    this.isModalOpen = true;
  }

  openEditModal(cuenta: CuentaBancaria): void {
    this.selectedCuenta = cuenta;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCuenta = undefined;
  }

  onCuentaSaved(cuenta: CuentaBancaria): void {
    this.loadCuentas();
    this.closeModal();
  }
}
