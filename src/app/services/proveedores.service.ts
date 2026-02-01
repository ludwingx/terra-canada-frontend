import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Proveedor, Servicio } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private mapProveedor(p: any): Proveedor {
    const servicioId = Number(p?.servicioId ?? p?.servicio_id ?? p?.servicio?.id ?? 0);
    const servicioNombre = p?.servicio?.nombre ?? p?.servicio_nombre;
    const servicio: Servicio | undefined = servicioNombre
      ? ({
          id: servicioId,
          nombre: String(servicioNombre),
          activo: true,
          fechaCreacion: new Date(),
        } as any)
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
            fechaCreacion: c?.fechaCreacion ?? c?.fecha_creacion,
          }))
        : undefined,
      fechaCreacion: p?.fechaCreacion ?? p?.fecha_creacion,
      fechaActualizacion: p?.fechaActualizacion ?? p?.fecha_actualizacion,
    } as Proveedor;
  }

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  getProveedores(servicioId?: number): Observable<Proveedor[]> {
    const params = servicioId ? { servicio_id: servicioId } : {};
    return this.api
      .get<{ success?: boolean; estado?: boolean; data: any }>(`proveedores`, params)
      .pipe(
        tap((res) => console.log('GET Proveedores response:', res)),
        map((res) => {
          const rawData = res.data?.data || res.data || [];
          return (Array.isArray(rawData) ? rawData : []).map((p) => this.mapProveedor(p));
        }),
      );
  }

  getProveedor(id: number): Observable<Proveedor> {
    return this.api
      .get<{ success?: boolean; estado?: boolean; data: any }>(`proveedores/${id}`)
      .pipe(
        tap((res) => console.log(`GET Proveedor ${id} response:`, res)),
        map((res) => this.mapProveedor(res.data?.data || res.data)),
      );
  }

  createProveedor(proveedor: any): Observable<Proveedor> {
    const payload = {
      nombre: proveedor.nombre,
      servicio_id: proveedor.servicioId ?? proveedor.servicio_id,
      lenguaje: proveedor.lenguaje || null,
      telefono: proveedor.telefono || null,
      descripcion: proveedor.descripcion || null,
      correos: Array.isArray(proveedor.correos) ? proveedor.correos : [],
      usuario_id: this.getUsuarioIdForAudit(proveedor),
    };
    console.log('POST Proveedor payload:', payload);

    return this.api.post<{ success: boolean; data: any }>(`proveedores`, payload).pipe(
      tap((res) => console.log('POST Proveedor response:', res)),
      map((res) => this.mapProveedor(res.data?.data || res.data)),
    );
  }

  updateProveedor(id: number, proveedor: any): Observable<Proveedor> {
    const payload = {
      nombre: proveedor.nombre,
      servicio_id: proveedor.servicioId ?? proveedor.servicio_id,
      lenguaje: proveedor.lenguaje,
      telefono: proveedor.telefono,
      descripcion: proveedor.descripcion,
      activo: proveedor.activo,
      usuario_id: this.getUsuarioIdForAudit(proveedor),
    };
    console.log(`PUT Proveedor ${id} payload:`, payload);

    return this.api.put<{ success: boolean; data: any }>(`proveedores/${id}`, payload).pipe(
      tap((res) => console.log(`PUT Proveedor ${id} response:`, res)),
      map((res) => this.mapProveedor(res.data?.data || res.data)),
    );
  }

  deleteProveedor(id: number): Observable<void> {
    const usuario_id = this.getUsuarioIdForAudit();
    const params = usuario_id ? { usuario_id } : {};
    console.log(`DELETE Proveedor ${id} params:`, params);

    return this.api.delete<{ success: boolean; data: any }>(`proveedores/${id}`, params).pipe(
      tap((res) => console.log(`DELETE Proveedor ${id} response:`, res)),
      map(() => undefined),
    );
  }

  addCorreo(proveedorId: number, correoData: any): Observable<any> {
    console.log(`POST Proveedor ${proveedorId} correo payload:`, correoData);
    return this.api
      .post<{ success: boolean; data: any }>(`proveedores/${proveedorId}/correos`, correoData)
      .pipe(
        tap((res) => console.log(`POST Proveedor ${proveedorId} correo response:`, res)),
        map((res) => res.data),
      );
  }
}
