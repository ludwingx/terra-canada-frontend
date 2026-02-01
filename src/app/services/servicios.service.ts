import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Servicio } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private api = inject(ApiService);

  private mapServicio(s: any): Servicio {
    return {
      id: Number(s?.id),
      nombre: String(s?.nombre ?? ''),
      descripcion: s?.descripcion ?? undefined,
      activo: Boolean(s?.activo ?? true),
      fechaCreacion: s?.fecha_creacion || s?.fechaCreacion,
    } as Servicio;
  }

  getServicios(): Observable<Servicio[]> {
    return this.api.get<{ success: boolean; data: any }>(`servicios`).pipe(
      tap((res) => console.log('GET Servicios response:', res)),
      map((res) => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map((s) => this.mapServicio(s));
      }),
    );
  }

  getServicio(id: number): Observable<Servicio> {
    return this.api.get<{ success: boolean; data: any }>(`servicios/${id}`).pipe(
      tap((res) => console.log(`GET Servicio ${id} response:`, res)),
      map((res) => this.mapServicio(res.data?.data || res.data)),
    );
  }

  createServicio(servicio: any): Observable<Servicio> {
    console.log('POST Servicio payload:', servicio);
    return this.api.post<{ success: boolean; data: any }>(`servicios`, servicio).pipe(
      tap((res) => console.log('POST Servicio response:', res)),
      map((res) => this.mapServicio(res.data?.data || res.data)),
    );
  }

  updateServicio(id: number, servicio: any): Observable<Servicio> {
    console.log(`PUT Servicio ${id} payload:`, servicio);
    return this.api.put<{ success: boolean; data: any }>(`servicios/${id}`, servicio).pipe(
      tap((res) => console.log(`PUT Servicio ${id} response:`, res)),
      map((res) => this.mapServicio(res.data?.data || res.data)),
    );
  }

  deleteServicio(id: number): Observable<void> {
    console.log(`DELETE Servicio ${id}`);
    return this.api.delete<{ success: boolean; data: any }>(`servicios/${id}`).pipe(
      tap((res) => console.log(`DELETE Servicio ${id} response:`, res)),
      map(() => undefined),
    );
  }
}
