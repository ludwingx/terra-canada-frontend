import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Evento, TipoEvento } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private api = inject(ApiService);

  private mapEvento(e: any): Evento {
    return {
      id: Number(e.id),
      usuarioId: e.usuario_id ?? e.usuarioId,
      usuario: e.usuario ? {
        id: Number(e.usuario.id),
        nombreCompleto: String(e.usuario.nombre_completo ?? e.usuario.nombreCompleto ?? ''),
        rol: String(e.usuario.rol ?? '')
      } as any : undefined,
      tipoEvento: (e.tipo_evento ?? e.tipoEvento ?? 'CREAR') as TipoEvento,
      entidadTipo: String(e.entidad_tipo ?? e.entidadTipo ?? ''),
      entidadId: e.entidad_id ?? e.entidadId,
      descripcion: String(e.descripcion ?? ''),
      ipOrigen: e.ip_origen ?? e.ipOrigen,
      userAgent: e.user_agent ?? e.userAgent,
      fechaEvento: e.fecha_evento ?? e.fechaEvento
    } as Evento;
  }

  getEventos(filters?: any): Observable<Evento[]> {
    return this.api.get<{success: boolean, data: any}>(`eventos`, filters).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map(e => this.mapEvento(e));
      })
    );
  }

  registrarEvento(evento: Partial<Evento>): Observable<any> {
    return this.api.post<{success: boolean, data: any}>(`eventos`, evento).pipe(
      map(res => this.mapEvento(res.data?.data || res.data))
    );
  }
}
