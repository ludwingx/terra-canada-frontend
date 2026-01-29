import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { CuentaBancaria } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private api = inject(ApiService);

  getCuentas(clienteId?: number): Observable<CuentaBancaria[]> {
    const params = clienteId ? { cliente_id: clienteId } : {};
    return this.api.get<{success: boolean, data: CuentaBancaria[]}>(`cuentas`, params).pipe(
      map(res => res.data)
    );
  }

  createCuenta(cuenta: any): Observable<CuentaBancaria> {
    return this.api.post<{success: boolean, data: CuentaBancaria}>(`cuentas`, cuenta).pipe(
      map(res => res.data)
    );
  }
}
