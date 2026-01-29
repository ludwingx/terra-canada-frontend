import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Pago } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private api = inject(ApiService);

  getPagos(filters?: any): Observable<Pago[]> {
    return this.api.get<{success: boolean, data: Pago[]}>(`pagos`, filters).pipe(
      map(res => res.data)
    );
  }

  createPago(pago: any): Observable<Pago> {
    return this.api.post<{success: boolean, data: Pago}>(`pagos`, pago).pipe(
      map(res => res.data)
    );
  }

  updatePago(id: number, update: any): Observable<Pago> {
    return this.api.put<{success: boolean, data: Pago}>(`pagos/${id}`, update).pipe(
      map(res => res.data)
    );
  }

  cancelarPago(id: number): Observable<void> {
    return this.api.delete<{success: boolean, data: null}>(`pagos/${id}`).pipe(
      map(() => undefined)
    );
  }
}
