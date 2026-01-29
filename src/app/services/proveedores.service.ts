import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Proveedor } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private api = inject(ApiService);

  getProveedores(servicioId?: number): Observable<Proveedor[]> {
    const params = servicioId ? { servicio_id: servicioId } : {};
    return this.api.get<{success: boolean, data: Proveedor[]}>(`proveedores`, params).pipe(
      map(res => res.data)
    );
  }

  createProveedor(proveedor: any): Observable<Proveedor> {
    return this.api.post<{success: boolean, data: Proveedor}>(`proveedores`, proveedor).pipe(
      map(res => res.data)
    );
  }

  addCorreo(proveedorId: number, correoData: any): Observable<any> {
    return this.api.post<{success: boolean, data: any}>(`proveedores/${proveedorId}/correos`, correoData).pipe(
      map(res => res.data)
    );
  }
}
