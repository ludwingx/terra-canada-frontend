import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Documento } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private api = inject(ApiService);

  getDocumentos(): Observable<Documento[]> {
    return this.api.get<{success: boolean, data: Documento[]}>(`documentos`).pipe(
      map(res => res.data)
    );
  }

  subirDocumento(file: File, tipoDocumento: string, pagoId?: number): Observable<Documento> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipoDocumento', tipoDocumento);
    if (pagoId) formData.append('pagoId', pagoId.toString());

    // El endpoint de subida suele ser multipart/form-data
    return this.api.post<{success: boolean, data: Documento}>(`documentos/subir`, formData).pipe(
      map(res => res.data)
    );
  }
}
