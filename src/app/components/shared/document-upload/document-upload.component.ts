import { Component, Input, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { PagosService } from '../../../services/pagos.service';
import { AuditoriaService } from '../../../services/auditoria.service';
import { I18nService } from '../../../services/i18n.service';
import { Pago, TipoEvento } from '../../../models/interfaces';

interface DocumentCard {
  id: string;
  titleKey: string;
  icon: string;
  descriptionKey: string;
  hintKey?: string;
  files: File[];
  scanMessage: string | null;
  scanError: string | null;
  isScanSuccess: boolean;
}

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.scss',
})
export class DocumentUploadComponent {
  @Input() pago: Pago | null = null;
  @Input() modulo: 'tarjetas' | 'c_bancarias' = 'tarjetas';

  isScanning = false;
  activeScanCardId: string | null = null;

  documentCards: DocumentCard[] = [
    {
      id: 'invoices',
      titleKey: 'docUploadInvoicesTitle',
      icon: 'pi pi-file-pdf',
      descriptionKey: 'docUploadInvoicesDesc',
      hintKey: 'docUploadInvoicesHint',
      files: [],
      scanMessage: null,
      scanError: null,
      isScanSuccess: false,
    },
    // {
    //   id: 'bank-doc', // Disabled as per reference comment or keep enabled? Reference had it.
    //   titleKey: 'docUploadBankDocTitle',
    //   icon: 'pi pi-file-word',
    //   descriptionKey: 'docUploadBankDocDesc',
    //   hintKey: 'docUploadBankDocHint',
    //   files: [],
    //   scanMessage: null,
    //   scanError: null,
    //   isScanSuccess: false
    // }
  ];

  private pagosService = inject(PagosService);
  private auditoriaService = inject(AuditoriaService);
  private cdr = inject(ChangeDetectorRef);
  private i18nService = inject(I18nService);

  constructor() {}

  onFileSelected(event: Event, cardId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const card = this.documentCards.find((c) => c.id === cardId);
      if (card) {
        const file = input.files[0];
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          card.files.push(file); // Simplificado: 1 file por demo, o push all
          console.log('File selected:', file);
        } else {
          card.scanError = this.t('docUploadOnlyPdfError');
        }
      }
    }
  }

  triggerFileInput(cardId: string): void {
    const input = document.getElementById(`file-input-${cardId}`) as HTMLInputElement;
    if (input) input.click();
  }

  removeFile(cardId: string, index: number): void {
    const card = this.documentCards.find((c) => c.id === cardId);
    if (card) card.files.splice(index, 1);
  }

  onScanCard(cardId: string): void {
    this.activeScanCardId = cardId;
    const card = this.documentCards.find((c) => c.id === cardId);
    if (!card || card.files.length === 0) return;

    this.isScanning = true;
    card.scanMessage = this.t('docUploadScanning');
    card.scanError = null;

    const file = card.files[0]; // Process first file
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      this.scanDocumento(base64, 1);
    };
    reader.readAsDataURL(file);
  }

  private scanDocumento(pdfBase64: string, count: number): void {
    const card = this.documentCards.find((c) => c.id === this.activeScanCardId);

    const pagoId = this.pago?.id;
    // const numeroPresta = this.pago?.numero_presta; // Verificar si existe

    this.pagosService.scanPagoDocumento(pdfBase64, pagoId, undefined).subscribe({
      next: (res: any) => {
        if (card) {
          card.isScanSuccess = true;
          card.scanMessage = res.mensaje || 'Validado';
        }
        this.registrarEventoSubidaPdf('FACTURA', count);
        this.isScanning = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        if (card) {
          card.isScanSuccess = false;
          card.scanError = err.error?.mensaje || 'Error';
        }
        this.isScanning = false;
        this.cdr.detectChanges();
      },
    });
  }

  private registrarEventoSubidaPdf(origen: 'FACTURA' | 'RECIBIENDO', count: number): void {
    // Implement logic using AuditoriaService.registrarEvento
    // Necesito adaptar Evento interface.
    const evento: any = {
      tipoEvento: 'VERIFICAR_PAGO',
      entidadTipo: this.pago ? 'PAGO' : 'DOCUMENTO',
      entidadId: this.pago?.id,
      descripcion: `Escaneo de PDF (${count})`,
      fechaEvento: new Date(),
    };
    this.auditoriaService.registrarEvento(evento).subscribe();
  }

  private t(key: string): string {
    return this.i18nService.t(key);
  }
}
