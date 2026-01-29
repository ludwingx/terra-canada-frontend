import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { CuentaBancaria } from '../../models/interfaces';

@Component({
  selector: 'app-cuentas-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cuentas-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('accounts.title') }}</h1>
          <p class="header-subtitle">{{ cuentas.length }} {{ i18n.language() === 'fr' ? 'comptes enregistrés' : 'cuentas registradas' }}</p>
        </div>
        <button class="btn btn-primary">
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
export class CuentasListComponent {
  i18n = inject(I18nService);

  cuentas: CuentaBancaria[] = [
    { id: 1, nombreBanco: 'Banque Nationale', nombreCuenta: 'Compte Opérations', ultimos4Digitos: '3421', moneda: 'CAD', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 2, nombreBanco: 'TD Bank', nombreCuenta: 'Business USD', ultimos4Digitos: '8876', moneda: 'USD', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
    { id: 3, nombreBanco: 'Desjardins', nombreCuenta: 'Épargne Entreprise', ultimos4Digitos: '2245', moneda: 'CAD', activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }
  ];
}
