import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Evento } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private api = inject(ApiService);

  getEventos(filters?: any): Observable<Evento[]> {
    return this.api.get<{success: boolean, data: any}>(`eventos`, filters).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return Array.isArray(rawData) ? rawData : [];
      })
    );
  }

  registrarEvento(evento: Partial<Evento>): Observable<any> {
    return this.api.post<{success: boolean, data: any}>(`eventos`, evento);
  }
}
