import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { Documento } from '../../models/interfaces';
import { DocumentoModalComponent } from '../../components/modals/documento-modal/documento-modal.component';
import { DocumentosService } from '../../services/documentos.service';

@Component({
  selector: 'app-documentos-list',
  standalone: true,
  imports: [CommonModule, DocumentoModalComponent],
  template: `
    <div class="documentos-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('documents.title') }}</h1>
          <p class="header-subtitle">{{ documentos.length }} {{ i18n.language() === 'fr' ? 'documents' : 'documentos' }}</p>
        </div>
        <button class="btn btn-primary" (click)="openUploadModal()">
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

      <app-documento-modal
        [isOpen]="isModalOpen"
        (closed)="closeModal()"
        (saved)="onDocumentoSaved($event)"
      />
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
export class DocumentosListComponent implements OnInit {
  i18n = inject(I18nService);
  private documentosService = inject(DocumentosService);

  isModalOpen = false;
  loading = false;
  documentos: Documento[] = [];

  ngOnInit(): void {
    this.loadDocumentos();
  }

  loadDocumentos(): void {
    this.loading = true;
    this.documentosService.getDocumentos().subscribe({
      next: (docs) => {
        this.documentos = docs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando documentos:', err);
        this.loading = false;
      }
    });
  }

  openUploadModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onDocumentoSaved(documento: Documento): void {
    this.loadDocumentos();
    this.closeModal();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES');
  }
}
