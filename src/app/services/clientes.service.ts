import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Cliente } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private api = inject(ApiService);

  getClientes(): Observable<Cliente[]> {
    return this.api.get<{success: boolean, data: Cliente[]}>(`clientes`).pipe(
      map(res => res.data)
    );
  }

  createCliente(cliente: any): Observable<Cliente> {
    return this.api.post<{success: boolean, data: Cliente}>(`clientes`, cliente).pipe(
      map(res => res.data)
    );
  }
}
