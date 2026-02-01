import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Cliente } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private mapCliente(c: any): Cliente {
    // console.log('Mapping cliente:', c);
    return {
      id: Number(c?.id),
      nombre: String(c?.nombre ?? ''),
      ubicacion: c?.ubicacion ?? undefined,
      telefono: c?.telefono ?? undefined,
      correo: c?.correo ?? undefined,
      activo: Boolean(c?.activo ?? true),
      fechaCreacion: c?.fechaCreacion ?? c?.fecha_creacion,
      fechaActualizacion: c?.fechaActualizacion ?? c?.fecha_actualizacion,
    } as Cliente;
  }

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  getClientes(): Observable<Cliente[]> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`clientes`).pipe(
      tap((res) => console.log('GET Clientes response:', res)),
      map((res) => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map((c) => this.mapCliente(c));
      }),
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`clientes/${id}`).pipe(
      tap((res) => console.log(`GET Cliente ${id} response:`, res)),
      map((res) => this.mapCliente(res.data?.data || res.data)),
    );
  }

  createCliente(cliente: any): Observable<Cliente> {
    const payload = {
      nombre: cliente?.nombre,
      correo: cliente?.correo ?? cliente?.email ?? null,
      telefono: cliente?.telefono ?? null,
      ubicacion: cliente?.ubicacion ?? cliente?.direccion ?? null,
      usuario_id: this.getUsuarioIdForAudit(cliente),
    };
    console.log('POST Cliente payload:', payload);

    return this.api.post<{ success: boolean; data: any }>(`clientes`, payload).pipe(
      tap((res) => console.log('POST Cliente response:', res)),
      map((res) => this.mapCliente(res.data?.data || res.data)),
    );
  }

  updateCliente(id: number, cliente: any): Observable<Cliente> {
    const payload = {
      nombre: cliente?.nombre,
      correo: cliente?.correo ?? cliente?.email ?? null,
      telefono: cliente?.telefono ?? null,
      ubicacion: cliente?.ubicacion ?? cliente?.direccion ?? null,
      activo: cliente?.activo,
      usuario_id: this.getUsuarioIdForAudit(cliente),
    };
    console.log(`PUT Cliente ${id} payload:`, payload);

    return this.api.put<{ success: boolean; data: any }>(`clientes/${id}`, payload).pipe(
      tap((res) => console.log(`PUT Cliente ${id} response:`, res)),
      map((res) => this.mapCliente(res.data?.data || res.data)),
    );
  }

  deleteCliente(id: number): Observable<void> {
    const usuario_id = this.getUsuarioIdForAudit();
    const params = usuario_id ? { usuario_id } : {};
    console.log(`DELETE Cliente ${id} params:`, params);

    return this.api.delete<{ success: boolean; data: any }>(`clientes/${id}`, params).pipe(
      tap((res) => console.log(`DELETE Cliente ${id} response:`, res)),
      map(() => undefined),
    );
  }
}
