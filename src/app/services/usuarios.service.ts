import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
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
      rolId: Number(u?.rolId ?? u?.rol_id ?? u?.rol?.id ?? u?.rol_id ?? 0),
      rol: u?.rol
        ? { id: Number(u.rol.id), nombre: String(u.rol.nombre) }
        : (u?.rol_nombre ? { id: Number(u?.rol_id ?? 0), nombre: String(u.rol_nombre) } : undefined),
      telefono: u?.telefono ?? undefined,
      activo: Boolean(u?.activo ?? true),
      fechaCreacion: u?.fechaCreacion ?? u?.fecha_creacion,
      fechaActualizacion: u?.fechaActualizacion ?? u?.fecha_actualizacion
    } as Usuario;
  }

  getUsuarios(): Observable<Usuario[]> {
    if (this.usuarios$) {
      return this.usuarios$;
    }

    this.usuarios$ = this.api.get<{ success?: boolean; estado?: boolean; data: any[] }>(`usuarios`).pipe(
      map(res => (res.data || []).map(u => this.mapUsuario(u))),
      tap({
        error: () => this.clearCache()
      }),
      shareReplay(1)
    );

    return this.usuarios$;
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`usuarios/${id}`).pipe(
      map(res => this.mapUsuario(res.data))
    );
  }

  createUsuario(usuario: any): Observable<Usuario> {
    return this.api.post<{ success?: boolean; estado?: boolean; data: any }>(`usuarios`, usuario).pipe(
      map(res => this.mapUsuario(res.data)),
      tap(() => this.clearCache())
    );
  }

  updateUsuario(id: number, usuario: any): Observable<Usuario> {
    return this.api.put<{ success?: boolean; estado?: boolean; data: any }>(`usuarios/${id}`, usuario).pipe(
      map(res => this.mapUsuario(res.data)),
      tap(() => this.clearCache())
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.api.delete<{ success?: boolean; estado?: boolean; data: null }>(`usuarios/${id}`).pipe(
      map(() => undefined),
      tap(() => this.clearCache())
    );
  }
}
