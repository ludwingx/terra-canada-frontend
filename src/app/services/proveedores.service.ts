import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Proveedor, Servicio } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private mapProveedor(p: any): Proveedor {
    const servicioId = Number(p?.servicioId ?? p?.servicio_id ?? p?.servicio?.id ?? 0);
    const servicioNombre = p?.servicio?.nombre ?? p?.servicio_nombre;
    const servicio: Servicio | undefined = servicioNombre
      ? ({ id: servicioId, nombre: String(servicioNombre), activo: true, fechaCreacion: new Date() } as any)
      : undefined;

    return {
      id: Number(p?.id),
      nombre: String(p?.nombre ?? ''),
      servicioId,
      servicio,
      lenguaje: p?.lenguaje ?? undefined,
      telefono: p?.telefono ?? undefined,
      descripcion: p?.descripcion ?? undefined,
      activo: Boolean(p?.activo ?? true),
      correos: Array.isArray(p?.correos)
        ? p.correos.map((c: any) => ({
            id: Number(c?.id),
            proveedorId: Number(p?.id),
            correo: String(c?.correo ?? ''),
            principal: Boolean(c?.principal ?? false),
            activo: Boolean(c?.activo ?? true),
            fechaCreacion: c?.fechaCreacion ?? c?.fecha_creacion
          }))
        : undefined,
      fechaCreacion: p?.fechaCreacion ?? p?.fecha_creacion,
      fechaActualizacion: p?.fechaActualizacion ?? p?.fecha_actualizacion
    } as Proveedor;
  }

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
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`proveedores`, params).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map(p => this.mapProveedor(p));
      })
    );
  }

  createProveedor(proveedor: any): Observable<Proveedor> {
    const payload = this.toCreateProveedorPayload(proveedor);
    return this.api.post<{success: boolean, data: any}>(`proveedores`, payload).pipe(
      map(res => this.mapProveedor(res.data?.data || res.data))
    );
  }

  addCorreo(proveedorId: number, correoData: any): Observable<any> {
    return this.api.post<{success: boolean, data: any}>(`proveedores/${proveedorId}/correos`, correoData).pipe(
      map(res => res.data)
    );
  }
}
