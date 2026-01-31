import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { Observable, map, of, tap, shareReplay } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  
  currentUser = signal<Usuario | null>(null);
  private me$?: Observable<Usuario>;

  private mapUsuario(u: any): Usuario {
    return {
      id: Number(u?.id),
      nombreUsuario: String(u?.nombreUsuario ?? u?.nombre_usuario ?? ''),
      correo: String(u?.correo ?? u?.email ?? ''),
      nombreCompleto: String(u?.nombreCompleto ?? u?.nombre_completo ?? ''),
      rolId: Number(u?.rolId ?? u?.rol_id ?? u?.rol?.id ?? 0),
      rol: u?.rol
        ? { id: Number(u.rol.id), nombre: String(u.rol.nombre), descripcion: u?.rol?.descripcion }
        : undefined,
      telefono: u?.telefono ?? undefined,
      activo: Boolean(u?.activo ?? true),
      fechaCreacion: u?.fechaCreacion ?? u?.fecha_creacion,
      fechaActualizacion: u?.fechaActualizacion ?? u?.fecha_actualizacion
    } as Usuario;
  }

  login(credentials: { username: string; password: string }): Observable<{ token: string; usuario: Usuario }> {
    return this.api.post<{ estado: boolean; data: { token: string; usuario?: any; user?: any } }>(`auth/login`, credentials, { noAuth: true }).pipe(
      tap(res => {
        if (res.estado && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('jwt_token', res.data.token);
          localStorage.setItem('token', res.data.token);
          const rawUser = res.data.usuario ?? res.data.user;
          const mapped = this.mapUsuario(rawUser);
          this.currentUser.set(mapped);
          this.me$ = of(mapped);
        }
      }),
      map(res => {
        const rawUser = res.data.usuario ?? res.data.user;
        return { token: res.data.token, usuario: this.mapUsuario(rawUser) };
      })
    );
  }

  register(payload: {
    nombre_usuario: string;
    nombre_completo: string;
    email: string;
    password: string;
    rol_id: number;
  }): Observable<Usuario> {
    return this.api.post<{ success?: boolean; estado?: boolean; data: Usuario }>('usuarios', {
      nombre_usuario: payload.nombre_usuario,
      nombre_completo: payload.nombre_completo,
      correo: payload.email,
      contrasena: payload.password,
      rol_id: payload.rol_id
    }).pipe(
      map(res => res.data)
    );
  }

  getMe(): Observable<Usuario> {
    if (this.me$) {
      return this.me$;
    }

    this.me$ = this.api.get<{ success?: boolean; estado?: boolean; data: Usuario }>(`auth/me`).pipe(
      map(res => this.mapUsuario(res.data)),
      tap(user => this.currentUser.set(user)),
      shareReplay(1)
    );

    return this.me$;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('token');
    }
    this.currentUser.set(null);
    this.me$ = undefined;
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!(localStorage.getItem('jwt_token') || localStorage.getItem('token'));
    }
    return false;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUser();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    // Assuming role names are uppercase in DB based on interface RolUsuario = 'ADMIN' | 'SUPERVISOR' | 'EQUIPO'
    return user?.rol?.nombre?.toUpperCase() === role.toUpperCase();
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isEquipo(): boolean {
    return this.hasRole('EQUIPO');
  }

  // Basic implementation of module access
  hasModuleAccess(module: string): boolean {
    if (this.isAdmin()) return true;
    // Add specific logic per role or store functionality/permissions in user object
    return true; 
  }
}
