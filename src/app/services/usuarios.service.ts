import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private api = inject(ApiService);
  private usuarios$?: Observable<Usuario[]>;

  private clearCache(): void {
    this.usuarios$ = undefined;
  }

  private mapUsuario(u: any): Usuario {
    return {
      id: Number(u?.id),
      nombreUsuario: String(u?.nombreUsuario ?? u?.nombre_usuario ?? ''),
      correo: String(u?.correo ?? u?.email ?? ''),
      nombreCompleto: String(u?.nombreCompleto ?? u?.nombre_completo ?? ''),
      rolId: Number(u?.rolId ?? u?.rol_id ?? u?.rol?.id ?? 0),
      rol: u?.rol
        ? { id: Number(u.rol.id), nombre: String(u.rol.nombre), descripcion: u?.rol?.descripcion }
        : u?.rol_nombre
          ? { id: Number(u?.rol_id ?? 0), nombre: String(u.rol_nombre) }
          : undefined,
      telefono: u?.telefono ?? undefined,
      activo: Boolean(u?.activo ?? true),
      fechaCreacion: u?.fechaCreacion ?? u?.fecha_creacion,
      fechaActualizacion: u?.fechaActualizacion ?? u?.fecha_actualizacion,
    } as Usuario;
  }

  getUsuarios(forceRefresh: boolean = false): Observable<Usuario[]> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`usuarios`).pipe(
      tap((res) => console.log('GET Usuarios response:', res)),
      map((res) => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map((u) => this.mapUsuario(u));
      }),
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`usuarios/${id}`).pipe(
      tap((res) => console.log(`GET Usuario ${id} response:`, res)),
      map((res) => this.mapUsuario(res.data?.data || res.data)),
    );
  }

  createUsuario(usuario: any): Observable<Usuario> {
    console.log('POST Usuario payload:', usuario);
    return this.api
      .post<{ success?: boolean; estado?: boolean; data: any }>(`usuarios`, usuario)
      .pipe(
        tap((res) => {
          console.log('POST Usuario response:', res);
          this.clearCache();
        }),
        map((res) => this.mapUsuario(res.data?.data || res.data)),
      );
  }

  updateUsuario(id: number, usuario: any): Observable<Usuario> {
    console.log(`PUT Usuario ${id} payload:`, usuario);
    return this.api
      .put<{ success?: boolean; estado?: boolean; data: any }>(`usuarios/${id}`, usuario)
      .pipe(
        tap((res) => {
          console.log(`PUT Usuario ${id} response:`, res);
          this.clearCache();
        }),
        map((res) => this.mapUsuario(res.data?.data || res.data)),
      );
  }

  deleteUsuario(id: number): Observable<void> {
    console.log(`DELETE Usuario ${id}`);
    return this.api
      .delete<{ success?: boolean; estado?: boolean; data: null }>(`usuarios/${id}`)
      .pipe(
        tap((res) => {
          console.log(`DELETE Usuario ${id} response:`, res);
          this.clearCache();
        }),
        map(() => undefined),
      );
  }
}
