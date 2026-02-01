import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { TarjetaCredito, TipoMoneda } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TarjetasService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private mapTarjeta(t: any): TarjetaCredito {
    return {
      id: Number(t?.id),
      nombreTitular: String(t?.nombreTitular ?? t?.nombre_titular ?? ''),
      ultimos4Digitos: String(t?.ultimos4Digitos ?? t?.ultimos_4_digitos ?? ''),
      moneda: String(t?.moneda ?? 'CAD') as TipoMoneda,
      limiteMensual: Number(t?.limiteMensual ?? t?.limite_mensual ?? 0),
      saldoDisponible: Number(t?.saldoDisponible ?? t?.saldo_disponible ?? 0),
      tipoTarjeta: t?.tipoTarjeta ?? t?.tipo_tarjeta ?? undefined,
      activo: Boolean(t?.activo ?? true),
      fechaCreacion: t?.fechaCreacion ?? t?.fecha_creacion,
      fechaActualizacion: t?.fechaActualizacion ?? t?.fecha_actualizacion,
    } as TarjetaCredito;
  }

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  getTarjetas(clienteId?: number): Observable<TarjetaCredito[]> {
    const params = clienteId ? { cliente_id: clienteId } : {};
    return this.api
      .get<{ success?: boolean; estado?: boolean; data: any }>(`tarjetas`, params)
      .pipe(
        tap((res) => console.log('GET Tarjetas response:', res)),
        map((res) => {
          const rawData =
            (res as any)?.data?.data?.data ?? (res as any)?.data?.data ?? (res as any)?.data ?? res;
          return (Array.isArray(rawData) ? rawData : []).map((t) => this.mapTarjeta(t));
        }),
      );
  }

  getTarjeta(id: number): Observable<TarjetaCredito> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`tarjetas/${id}`).pipe(
      tap((res) => console.log(`GET Tarjeta ${id} response:`, res)),
      map((res) => this.mapTarjeta(res.data?.data || res.data)),
    );
  }

  createTarjeta(tarjeta: any): Observable<TarjetaCredito> {
    const payload = {
      nombre_titular: tarjeta?.nombre_titular ?? tarjeta?.nombreTitular,
      ultimos_4_digitos: tarjeta?.ultimos_4_digitos ?? tarjeta?.ultimos4Digitos,
      moneda: tarjeta?.moneda,
      limite_mensual: tarjeta?.limite_mensual ?? tarjeta?.limiteMensual,
      tipo_tarjeta: tarjeta?.tipo_tarjeta ?? tarjeta?.tipoTarjeta ?? null,
      activo: tarjeta?.activo ?? true,
      usuario_id: this.getUsuarioIdForAudit(tarjeta),
    };
    console.log('POST Tarjeta payload:', payload);

    return this.api.post<{ success: boolean; data: any }>(`tarjetas`, payload).pipe(
      tap((res) => console.log('POST Tarjeta response:', res)),
      map((res) => this.mapTarjeta(res.data?.data || res.data)),
    );
  }

  updateTarjeta(id: number, tarjeta: any): Observable<TarjetaCredito> {
    const payload = {
      nombre_titular: tarjeta?.nombre_titular ?? tarjeta?.nombreTitular,
      limite_mensual: tarjeta?.limite_mensual ?? tarjeta?.limiteMensual,
      tipo_tarjeta: tarjeta?.tipo_tarjeta ?? tarjeta?.tipoTarjeta,
      activo: tarjeta?.activo,
      usuario_id: this.getUsuarioIdForAudit(tarjeta),
    };
    console.log(`PUT Tarjeta ${id} payload:`, payload);

    return this.api.put<{ success: boolean; data: any }>(`tarjetas/${id}`, payload).pipe(
      tap((res) => console.log(`PUT Tarjeta ${id} response:`, res)),
      map((res) => this.mapTarjeta(res.data?.data || res.data)),
    );
  }

  deleteTarjeta(id: number): Observable<void> {
    console.log(`DELETE Tarjeta ${id}`);

    return this.api.delete<{ success: boolean; data: any }>(`tarjetas/${id}`).pipe(
      tap((res: any) => console.log(`DELETE Tarjeta ${id} response:`, res)),
      map(() => undefined),
    );
  }

  recargarTarjeta(id: number, monto: number): Observable<TarjetaCredito> {
    console.log(`POST Tarjeta ${id} recargar monto:`, monto);
    return this.api
      .post<{ success: boolean; data: any }>(`tarjetas/${id}/recargar`, { monto })
      .pipe(
        tap((res) => console.log(`POST Tarjeta ${id} recargar response:`, res)),
        map((res) => this.mapTarjeta(res.data?.data || res.data)),
      );
  }
}
