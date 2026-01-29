import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { TarjetaCredito } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {
  private api = inject(ApiService);

  getTarjetas(clienteId?: number): Observable<TarjetaCredito[]> {
    const params = clienteId ? { cliente_id: clienteId } : {};
    return this.api.get<{success: boolean, data: TarjetaCredito[]}>(`tarjetas`, params).pipe(
      map(res => res.data)
    );
  }

  createTarjeta(tarjeta: any): Observable<TarjetaCredito> {
    return this.api.post<{success: boolean, data: TarjetaCredito}>(`tarjetas`, tarjeta).pipe(
      map(res => res.data)
    );
  }

  recargarTarjeta(id: number, monto: number): Observable<TarjetaCredito> {
    return this.api.post<{success: boolean, data: TarjetaCredito}>(`tarjetas/${id}/recargar`, { monto }).pipe(
      map(res => res.data)
    );
  }
}
