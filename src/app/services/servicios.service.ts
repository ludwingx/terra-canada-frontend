import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Servicio } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private api = inject(ApiService);

  private mapServicio(s: any): Servicio {
    return {
      id: Number(s?.id),
      nombre: String(s?.nombre ?? ''),
      descripcion: s?.descripcion ?? undefined,
      activo: Boolean(s?.activo ?? true),
      fechaCreacion: s?.fecha_creacion || s?.fechaCreacion
    } as Servicio;
  }

  getServicios(): Observable<Servicio[]> {
    return this.api.get<{success: boolean, data: any}>(`servicios`).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map(s => this.mapServicio(s));
      })
    );
  }

  createServicio(servicio: any): Observable<Servicio> {
    return this.api.post<{success: boolean, data: any}>(`servicios`, servicio).pipe(
      map(res => this.mapServicio(res.data?.data || res.data))
    );
  }
}
