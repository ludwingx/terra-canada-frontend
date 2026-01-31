import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';
import { Documento } from '../../models/interfaces';
import { DocumentoModalComponent } from '../../components/modals/documento-modal/documento-modal.component';
import { DocumentosService } from '../../services/documentos.service';
import { ModalComponent } from '../../components/shared/modal/modal.component';

@Component({
  selector: 'app-documentos-list',
  standalone: true,
  imports: [CommonModule, DocumentoModalComponent, ModalComponent],
  template: `
    <div class="documentos-page">
      <div class="page-header">
        <div>
          <h1>{{ i18n.t('documents.title') }}</h1>
          <p class="header-subtitle">{{ documentos().length }} {{ i18n.t('documents.count') }}</p>
        </div>
        <button class="btn btn-primary" (click)="openUploadModal()">
          <span>📤</span>
          {{ i18n.t('documents.upload') }}
        </button>
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
                <th>{{ i18n.t('documents.filename') }}</th>
                <th>{{ i18n.t('documents.type') }}</th>
                <th>{{ i18n.t('payments.code') }}</th>
                <th>{{ i18n.t('documents.uploaded_by') }}</th>
                <th>{{ i18n.t('payments.date') }}</th>
                <th>{{ i18n.t('payments.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of documentos(); track doc.id) {
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
                    <button class="btn btn-secondary btn-sm" (click)="openViewModal(doc)">👁️ {{ i18n.t('actions.view') }}</button>
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

      <app-documento-modal
        [isOpen]="isUploadModalOpen"
        (closed)="closeUploadModal()"
        (saved)="onDocumentoSaved($event)"
      />

      <app-modal
        [isOpen]="isViewModalOpen"
        [title]="i18n.t('documents.view_title')"
        (closed)="closeViewModal()"
        [showFooter]="false"
        size="md"
      >
        @if (selectedDocumento) {
          <div class="document-viewer">
            <div class="viewer-details">
              <div class="detail-item">
                <span class="label">{{ i18n.t('documents.filename') }}</span>
                <span class="value">{{ selectedDocumento.nombreArchivo }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ i18n.t('documents.type') }}</span>
                <span class="value">
                  @if (selectedDocumento.tipoDocumento === 'FACTURA') {
                    {{ i18n.t('documents.invoice') }}
                  } @else {
                    {{ i18n.t('documents.bank_doc') }}
                  }
                </span>
              </div>
              <div class="detail-item">
                <span class="label">{{ i18n.t('documents.uploaded_by') }}</span>
                <span class="value">{{ selectedDocumento.usuario?.nombreCompleto || 'Admin' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ i18n.t('documents.uploaded_date') }}</span>
                <span class="value">{{ formatDate(selectedDocumento.fechaSubida) }}</span>
              </div>
              @if (selectedDocumento.pago) {
                <div class="detail-item">
                  <span class="label">{{ i18n.t('payments.code') }}</span>
                  <span class="value"><code class="text-primary">{{ selectedDocumento.pago.codigoReserva }}</code></span>
                </div>
              }
            </div>
            
            <div class="document-preview-placeholder">
              <span class="icon">📄</span>
              <p>{{ i18n.t('documents.preview_placeholder') }}</p>
              <a [href]="selectedDocumento.urlDocumento" target="_blank" class="btn btn-primary">
                {{ i18n.t('actions.open_full') }}
              </a>
            </div>
          </div>
        }
      </app-modal>
    </div>
  `,
  styles: [`
    .documentos-page {
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
    .document-viewer {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    .viewer-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      .label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
      .value { font-size: 13px; color: var(--text-primary); }
    }
    .document-preview-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      background: var(--bg-hover);
      border-radius: var(--border-radius);
      border: 2px dashed var(--border-color);
      text-align: center;
      gap: var(--spacing-md);

      .icon { font-size: 48px; }
      p { margin: 0; font-size: 14px; color: var(--text-secondary); }
    }
  `]
})
export class DocumentosListComponent implements OnInit {
  i18n = inject(I18nService);
  private documentosService = inject(DocumentosService);

  isUploadModalOpen = false;
  isViewModalOpen = false;
  selectedDocumento?: Documento;
  
  loading = signal(false);
  documentos = signal<Documento[]>([]);

  ngOnInit(): void {
    this.loadDocumentos();
  }

  loadDocumentos(): void {
    this.loading.set(true);
    this.documentosService.getDocumentos().subscribe({
      next: (data) => {
        this.documentos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando documentos:', err);
        this.loading.set(false);
      }
    });
  }

  openUploadModal(): void {
    this.isUploadModalOpen = true;
  }

  closeUploadModal(): void {
    this.isUploadModalOpen = false;
  }

  openViewModal(doc: Documento): void {
    this.selectedDocumento = doc;
    this.isViewModalOpen = true;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedDocumento = undefined;
  }

  onDocumentoSaved(documento: Documento): void {
    this.loadDocumentos();
    this.closeUploadModal();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.i18n.language() === 'fr' ? 'fr-CA' : 'es-ES');
  }
}
