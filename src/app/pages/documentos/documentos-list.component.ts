import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { Documento } from '../../models/interfaces';

@Component({
  selector: 'app-documentos-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="documentos-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('documents.title') }}</h1>
          <p class="header-subtitle">{{ documentos.length }} {{ i18n.language() === 'fr' ? 'documents' : 'documentos' }}</p>
        </div>
        <button class="btn btn-primary">
          <span>📤</span>
          {{ i18n.t('documents.upload') }}
        </button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('documents.filename') }}</th>
                <th>{{ i18n.t('documents.type') }}</th>
                <th>{{ i18n.t('payments.code') }}</th>
                <th>{{ i18n.t('documents.uploaded_by') }}</th>
                <th>{{ i18n.t('payments.date') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of documentos; track doc.id) {
                <tr>
                  <td>
                    <div class="file-name">
                      <span class="file-icon">📄</span>
                      {{ doc.nombreArchivo }}
                    </div>
                  </td>
                  <td>
                    @if (doc.tipoDocumento === 'FACTURA') {
                      <span class="badge badge-paid">{{ i18n.t('documents.invoice') }}</span>
                    } @else {
                      <span class="badge badge-verified">{{ i18n.t('documents.bank_doc') }}</span>
                    }
                  </td>
                  <td>
                    @if (doc.pago) {
                      <code class="text-primary">{{ doc.pago.codigoReserva }}</code>
                    } @else {
                      <span class="text-muted">-</span>
                    }
                  </td>
                  <td>{{ doc.usuario?.nombreCompleto || 'Admin' }}</td>
                  <td class="text-muted">{{ formatDate(doc.fechaSubida) }}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm">👁️ {{ i18n.t('actions.view') }}</button>
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
    .file-name {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    .file-icon { font-size: 18px; }
    code {
      background: var(--bg-hover);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
  `]
})
export class DocumentosListComponent {
  i18n = inject(I18nService);

  documentos: Documento[] = [
    { id: 1, usuarioId: 1, nombreArchivo: 'factura_voyage_001.pdf', urlDocumento: '/docs/1.pdf', tipoDocumento: 'FACTURA', pagoId: 1, pago: { id: 1, proveedorId: 1, usuarioId: 1, codigoReserva: 'RES-2026-001', monto: 2500, moneda: 'CAD', tipoMedioPago: 'TARJETA', pagado: true, verificado: true, gmailEnviado: true, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, fechaSubida: new Date('2026-01-28') },
    { id: 2, usuarioId: 1, nombreArchivo: 'extracto_enero_2026.pdf', urlDocumento: '/docs/2.pdf', tipoDocumento: 'DOCUMENTO_BANCO', fechaSubida: new Date('2026-01-27') },
    { id: 3, usuarioId: 1, nombreArchivo: 'factura_assurance_003.pdf', urlDocumento: '/docs/3.pdf', tipoDocumento: 'FACTURA', pagoId: 3, pago: { id: 3, proveedorId: 3, usuarioId: 1, codigoReserva: 'RES-2026-003', monto: 950, moneda: 'CAD', tipoMedioPago: 'TARJETA', pagado: false, verificado: false, gmailEnviado: false, activo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }, fechaSubida: new Date('2026-01-26') }
  ];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES');
  }
}
