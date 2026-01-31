import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Documento } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private api = inject(ApiService);

  private mapDocumento(d: any): Documento {
    return {
      id: Number(d.id),
      usuarioId: d.usuario_subida?.id ?? d.usuarioId,
      usuario: d.usuario_subida ? {
        id: Number(d.usuario_subida.id),
        nombreCompleto: String(d.usuario_subida.nombre_completo ?? ''),
      } as any : (d.usuario ? d.usuario : undefined),
      pagoId: d.pago_id ?? d.pagoId,
      pago: d.pago || undefined,
      nombreArchivo: String(d.nombre_archivo ?? d.nombreArchivo ?? ''),
      urlDocumento: String(d.url_documento ?? d.urlDocumento ?? ''),
      tipoDocumento: (d.tipo_documento ?? d.tipoDocumento ?? 'FACTURA'),
      fechaSubida: d.fecha_subida ?? d.fechaSubida
    } as Documento;
  }

  getDocumentos(): Observable<Documento[]> {
    return this.api.get<{success: boolean, data: any}>(`documentos`).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map(d => this.mapDocumento(d));
      })
    );
  }

  subirDocumento(file: File, tipoDocumento: string, pagoId?: number): Observable<Documento> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipoDocumento', tipoDocumento);
    if (pagoId) formData.append('pagoId', pagoId.toString());

    // El endpoint de subida suele ser multipart/form-data
    return this.api.post<{success: boolean, data: any}>(`documentos/subir`, formData).pipe(
      map(res => this.mapDocumento(res.data?.data || res.data))
    );
  }
}
