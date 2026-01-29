import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private api = inject(ApiService);

  getUsuarios(): Observable<Usuario[]> {
    return this.api.get<{success: boolean, data: Usuario[]}>(`usuarios`).pipe(
      map(res => res.data)
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.api.get<{success: boolean, data: Usuario}>(`usuarios/${id}`).pipe(
      map(res => res.data)
    );
  }

  createUsuario(usuario: any): Observable<Usuario> {
    return this.api.post<{success: boolean, data: Usuario}>(`usuarios`, usuario).pipe(
      map(res => res.data)
    );
  }

  updateUsuario(id: number, usuario: any): Observable<Usuario> {
    return this.api.put<{success: boolean, data: Usuario}>(`usuarios/${id}`, usuario).pipe(
      map(res => res.data)
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.api.delete<{success: boolean, data: null}>(`usuarios/${id}`).pipe(
      map(() => undefined)
    );
  }
}
