import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  
  currentUser = signal<Usuario | null>(null);

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.api.post<{success: boolean, data: {token: string, user: Usuario}}>(`auth/login`, credentials).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          this.currentUser.set(res.data.user);
        }
      }),
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
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
