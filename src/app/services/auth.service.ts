import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
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

  login(credentials: { nombre_usuario: string; password: string }): Observable<{ token: string; usuario: Usuario }> {
    return this.api.post<{ estado: boolean; data: { token: string; usuario: Usuario } }>(`auth/login`, credentials).pipe(
      tap(res => {
        if (res.estado && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('jwt_token', res.data.token);
          localStorage.setItem('token', res.data.token);
          this.currentUser.set(res.data.usuario);
        }
      }),
      map(res => res.data)
    );
  }

  register(payload: {
    nombre_usuario: string;
    nombre_completo: string;
    email: string;
    password: string;
    rol_id: number;
  }): Observable<Usuario> {
    return this.api.post<{ success: boolean; data: Usuario }>('usuarios', payload).pipe(
      map(res => res.data)
    );
  }

  getMe(): Observable<Usuario> {
    return this.api.get<{success: boolean, data: Usuario}>(`auth/me`).pipe(
      tap(res => this.currentUser.set(res.data)),
      map(res => res.data)
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('token');
    }
    this.currentUser.set(null);
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
