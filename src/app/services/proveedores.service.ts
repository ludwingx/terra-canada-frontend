import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Proveedor } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  private toCreateProveedorPayload(proveedor: any): any {
    const correosArray: Array<{ correo?: string | null }> = Array.isArray(proveedor?.correos)
      ? proveedor.correos
      : [];

    const correo1 = proveedor?.correo1 ?? correosArray?.[0]?.correo ?? null;
    const correo2 = proveedor?.correo2 ?? correosArray?.[1]?.correo ?? null;
    const correo3 = proveedor?.correo3 ?? correosArray?.[2]?.correo ?? null;
    const correo4 = proveedor?.correo4 ?? correosArray?.[3]?.correo ?? null;

    return {
      nombre: proveedor?.nombre,
      lenguaje: proveedor?.lenguaje,
      correo1,
      correo2,
      correo3,
      correo4,
      usuario_id: this.getUsuarioIdForAudit(proveedor)
    };
  }

  getProveedores(servicioId?: number): Observable<Proveedor[]> {
    const params = servicioId ? { servicio_id: servicioId } : {};
    return this.api.get<{success: boolean, data: Proveedor[]}>(`proveedores`, params).pipe(
      map(res => res.data)
    );
  }

  createProveedor(proveedor: any): Observable<Proveedor> {
    const payload = this.toCreateProveedorPayload(proveedor);
    return this.api.post<{success: boolean, data: Proveedor}>(`proveedores`, payload).pipe(
      map(res => res.data)
    );
  }

  addCorreo(proveedorId: number, correoData: any): Observable<any> {
    return this.api.post<{success: boolean, data: any}>(`proveedores/${proveedorId}/correos`, correoData).pipe(
      map(res => res.data)
    );
  }
}
