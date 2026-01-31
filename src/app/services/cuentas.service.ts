import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { CuentaBancaria, TipoMoneda } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private api = inject(ApiService);

  private mapCuenta(c: any): CuentaBancaria {
    return {
      id: Number(c?.id),
      nombreBanco: String(c?.nombreBanco ?? c?.nombre_banco ?? ''),
      nombreCuenta: String(c?.nombreCuenta ?? c?.nombre_cuenta ?? ''),
      ultimos4Digitos: String(c?.ultimos4Digitos ?? c?.ultimos_4_digitos ?? ''),
      moneda: String(c?.moneda ?? 'CAD') as TipoMoneda,
      activo: Boolean(c?.activo ?? true),
      fechaCreacion: c?.fechaCreacion ?? c?.fecha_creacion,
      fechaActualizacion: c?.fechaActualizacion ?? c?.fecha_actualizacion
    } as CuentaBancaria;
  }

  getCuentas(clienteId?: number): Observable<CuentaBancaria[]> {
    const params = clienteId ? { cliente_id: clienteId } : {};
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`cuentas`, params).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map(c => this.mapCuenta(c));
      })
    );
  }

  createCuenta(cuenta: any): Observable<CuentaBancaria> {
    return this.api.post<{success: boolean, data: any}>(`cuentas`, cuenta).pipe(
      map(res => this.mapCuenta(res.data?.data || res.data))
    );
  }
}
