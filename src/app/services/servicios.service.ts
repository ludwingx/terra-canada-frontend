import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Servicio } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private api = inject(ApiService);

  getServicios(): Observable<Servicio[]> {
    return this.api.get<{success: boolean, data: Servicio[]}>(`servicios`).pipe(
      map(res => res.data)
    );
  }

  createServicio(servicio: any): Observable<Servicio> {
    return this.api.post<{success: boolean, data: Servicio}>(`servicios`, servicio).pipe(
      map(res => res.data)
    );
  }
}
