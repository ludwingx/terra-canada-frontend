import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Pago } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  private toCreatePagoPayload(pago: any): any {
    return {
      proveedor_id: pago?.proveedor_id ?? pago?.proveedorId,
      usuario_id: this.getUsuarioIdForAudit(pago),
      codigo_reserva: pago?.codigo_reserva ?? pago?.codigoReserva,
      monto: pago?.monto,
      moneda: pago?.moneda,
      tipo_medio_pago: pago?.tipo_medio_pago ?? pago?.tipoMedioPago,
      tarjeta_id: pago?.tarjeta_id ?? pago?.tarjetaId ?? null,
      cuenta_bancaria_id: pago?.cuenta_bancaria_id ?? pago?.cuentaBancariaId ?? null,
      clientes_ids: pago?.clientes_ids ?? pago?.clientesIds ?? [],
      descripcion: pago?.descripcion ?? null,
      fecha_esperada_debito: pago?.fecha_esperada_debito ?? pago?.fechaEsperadaDebito ?? null
    };
  }

  private toUpdatePagoPayload(update: any): any {
    return {
      monto: update?.monto,
      descripcion: update?.descripcion ?? null,
      fecha_esperada_debito: update?.fecha_esperada_debito ?? update?.fechaEsperadaDebito ?? null,
      usuario_id: this.getUsuarioIdForAudit(update)
    };
  }

  getPagos(filters?: any): Observable<Pago[]> {
    return this.api.get<{success: boolean, data: Pago[]}>(`pagos`, filters).pipe(
      map(res => res.data)
    );
  }

  createPago(pago: any): Observable<Pago> {
    const payload = this.toCreatePagoPayload(pago);
    return this.api.post<{success: boolean, data: Pago}>(`pagos`, payload).pipe(
      map(res => res.data)
    );
  }

  updatePago(id: number, update: any): Observable<Pago> {
    const payload = this.toUpdatePagoPayload(update);
    return this.api.put<{success: boolean, data: Pago}>(`pagos/${id}`, payload).pipe(
      map(res => res.data)
    );
  }

  cancelarPago(id: number): Observable<void> {
    return this.api.delete<{success: boolean, data: null}>(`pagos/${id}`).pipe(
      map(() => undefined)
    );
  }

  scanPagoDocumento(pdfBase64: string, pagoId?: number, numeroPresta?: string): Observable<any> {
    const payload = { pdfBase64, pagoId, numeroPresta };
    return this.api.post<{success: boolean, mensaje: string}>(`pagos/scan-documento`, payload);
  }

  enviarDocumentosRecibiendoPdf(archivos: any[], modulo: string): Observable<any> {
    return this.api.post<{success: boolean, mensaje: string}>(`pagos/enviar-documentos`, { archivos, modulo });
  }

  enviarDocumentoBancoPdf(archivo: any, modulo: string): Observable<any> {
    return this.api.post<{success: boolean, mensaje: string}>(`pagos/enviar-documento-banco`, { archivo, modulo });
  }
}
