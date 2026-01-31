import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Cliente } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  getClientes(): Observable<Cliente[]> {
    return this.api.get<{success: boolean, data: Cliente[]}>(`clientes`).pipe(
      map(res => res.data)
    );
  }

  createCliente(cliente: any): Observable<Cliente> {
    const payload = {
      nombre: cliente?.nombre,
      email: cliente?.email ?? cliente?.correo ?? null,
      telefono: cliente?.telefono ?? null,
      direccion: cliente?.direccion ?? cliente?.ubicacion ?? null,
      notas: cliente?.notas ?? null,
      usuario_id: this.getUsuarioIdForAudit(cliente)
    };

    return this.api.post<{success: boolean, data: Cliente}>(`clientes`, payload).pipe(
      map(res => res.data)
    );
  }
}
