import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardPaymentRecordsComponent } from '../../components/shared/card-payment-records/card-payment-records.component';
import { PaymentFormComponent } from '../../components/shared/payment-form/payment-form.component';
import { DocumentUploadComponent } from '../../components/shared/document-upload/document-upload.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-financieros-tarjetas',
  standalone: true,
  imports: [
    CommonModule,
    CardPaymentRecordsComponent,
    PaymentFormComponent,
    DocumentUploadComponent,
    TranslatePipe
  ],
  templateUrl: './financieros-tarjetas.component.html',
  styleUrl: './financieros-tarjetas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancierosTarjetasComponent implements OnInit {
  showPaymentForm = false;
  showDocumentUpload = false;
  selectedPaymentForEdit: any = null;
  paymentForm: FormGroup;

  private fb = inject(FormBuilder);

  constructor() {
    this.paymentForm = this.fb.group({
      cliente: ['', Validators.required],
      clienteNombre: [''],
      proveedor: ['', Validators.required],
      proveedorNombre: [''],
      correo: [''],
      moneda: ['', Validators.required],
      tarjeta: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fechaFutura: [null],
      numeroPresta: ['', Validators.required],
      comentarios: ['']
    });
  }

  ngOnInit(): void {}

  togglePaymentForm(): void {
    this.showPaymentForm = !this.showPaymentForm;
    this.showDocumentUpload = false;
    this.selectedPaymentForEdit = null;
  }

  toggleDocumentUpload(): void {
    this.showDocumentUpload = !this.showDocumentUpload;
    this.showPaymentForm = false;
  }

  onEditPayment(payment: any): void {
    this.selectedPaymentForEdit = payment;
    this.showPaymentForm = true;
    this.showDocumentUpload = false;
  }

  onFormSubmit(): void {
    this.showPaymentForm = false;
    this.selectedPaymentForEdit = null;
    // Refresh list logic here if needed, or rely on component interaction
  }

  onFormCancel(): void {
    this.showPaymentForm = false;
    this.selectedPaymentForEdit = null;
  }
}
