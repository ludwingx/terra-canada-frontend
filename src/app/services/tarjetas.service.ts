import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { TarjetaCredito } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  private toCreateTarjetaPayload(tarjeta: any): any {
    return {
      nombre_titular: tarjeta?.nombre_titular ?? tarjeta?.nombreTitular,
      ultimos_4_digitos: tarjeta?.ultimos_4_digitos ?? tarjeta?.ultimos4Digitos,
      moneda: tarjeta?.moneda,
      limite_mensual: tarjeta?.limite_mensual ?? tarjeta?.limiteMensual,
      tipo_tarjeta: tarjeta?.tipo_tarjeta ?? tarjeta?.tipoTarjeta ?? null,
      activo: tarjeta?.activo ?? true,
      usuario_id: this.getUsuarioIdForAudit(tarjeta)
    };
  }

  getTarjetas(clienteId?: number): Observable<TarjetaCredito[]> {
    const params = clienteId ? { cliente_id: clienteId } : {};
    return this.api.get<{success: boolean, data: TarjetaCredito[]}>(`tarjetas`, params).pipe(
      map(res => res.data)
    );
  }

  createTarjeta(tarjeta: any): Observable<TarjetaCredito> {
    const payload = this.toCreateTarjetaPayload(tarjeta);
    return this.api.post<{success: boolean, data: TarjetaCredito}>(`tarjetas`, payload).pipe(
      map(res => res.data)
    );
  }

  recargarTarjeta(id: number, monto: number): Observable<TarjetaCredito> {
    return this.api.post<{success: boolean, data: TarjetaCredito}>(`tarjetas/${id}/recargar`, { monto }).pipe(
      map(res => res.data)
    );
  }
}
