import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CuentaBancaria, TipoMoneda } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private mapCuenta(c: any): CuentaBancaria {
    return {
      id: Number(c?.id),
      nombreBanco: String(c?.nombreBanco ?? c?.nombre_banco ?? ''),
      nombreCuenta: String(c?.nombreCuenta ?? c?.nombre_cuenta ?? ''),
      ultimos4Digitos: String(c?.ultimos4Digitos ?? c?.ultimos_4_digitos ?? ''),
      moneda: String(c?.moneda ?? 'CAD') as TipoMoneda,
      activo: Boolean(c?.activo ?? true),
      fechaCreacion: c?.fechaCreacion ?? c?.fecha_creacion,
      fechaActualizacion: c?.fechaActualizacion ?? c?.fecha_actualizacion,
    } as CuentaBancaria;
  }

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  getCuentas(clienteId?: number): Observable<CuentaBancaria[]> {
    const params = clienteId ? { cliente_id: clienteId } : {};
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`cuentas`, params).pipe(
      tap((res) => console.log('GET Cuentas response:', res)),
      map((res) => {
        const rawData =
          (res as any)?.data?.data?.data || (res as any)?.data?.data || (res as any)?.data || res;
        return (Array.isArray(rawData) ? rawData : []).map((c) => this.mapCuenta(c));
      }),
    );
  }

  getCuenta(id: number): Observable<CuentaBancaria> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`cuentas/${id}`).pipe(
      tap((res) => console.log(`GET Cuenta ${id} response:`, res)),
      map((res) => this.mapCuenta(res.data?.data || res.data)),
    );
  }

  createCuenta(cuenta: any): Observable<CuentaBancaria> {
    const payload = {
      nombre_banco: cuenta?.nombre_banco ?? cuenta?.nombreBanco,
      nombre_cuenta: cuenta?.nombre_cuenta ?? cuenta?.nombreCuenta,
      ultimos_4_digitos: cuenta?.ultimos_4_digitos ?? cuenta?.ultimos4Digitos,
      moneda: cuenta?.moneda,
      activo: cuenta?.activo ?? true,
      usuario_id: this.getUsuarioIdForAudit(cuenta),
    };
    console.log('POST Cuenta payload:', payload);

    return this.api.post<{ success: boolean; data: any }>(`cuentas`, payload).pipe(
      tap((res) => console.log('POST Cuenta response:', res)),
      map((res) => this.mapCuenta(res.data?.data || res.data)),
    );
  }

  updateCuenta(id: number, cuenta: any): Observable<CuentaBancaria> {
    const payload = {
      nombre_banco: cuenta?.nombre_banco ?? cuenta?.nombreBanco,
      nombre_cuenta: cuenta?.nombre_cuenta ?? cuenta?.nombreCuenta,
      activo: cuenta?.activo,
      usuario_id: this.getUsuarioIdForAudit(cuenta),
    };
    console.log(`PUT Cuenta ${id} payload:`, payload);

    return this.api.put<{ success: boolean; data: any }>(`cuentas/${id}`, payload).pipe(
      tap((res) => console.log(`PUT Cuenta ${id} response:`, res)),
      map((res) => this.mapCuenta(res.data?.data || res.data)),
    );
  }

  deleteCuenta(id: number): Observable<void> {
    const usuario_id = this.getUsuarioIdForAudit();
    const params = usuario_id ? { usuario_id } : {};
    console.log(`DELETE Cuenta ${id} params:`, params);

    return this.api.delete<{ success: boolean; data: any }>(`cuentas/${id}`, params).pipe(
      tap((res) => console.log(`DELETE Cuenta ${id} response:`, res)),
      map(() => undefined),
    );
  }
}
