import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { EnvioCorreo } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CorreosService {
  private api = inject(ApiService);

  getCorreos(): Observable<EnvioCorreo[]> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: EnvioCorreo[] }>(`correos`).pipe(
      map(res => res.data || [])
    );
  }

  getCorreo(id: number): Observable<EnvioCorreo> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: EnvioCorreo }>(`correos/${id}`).pipe(
      map(res => res.data)
    );
  }

  crearCorreoManual(payload: any): Observable<EnvioCorreo> {
    return this.api.post<{ success?: boolean; estado?: boolean; data: EnvioCorreo }>(`correos`, payload).pipe(
      map(res => res.data)
    );
  }

  actualizarCorreo(id: number, payload: any): Observable<EnvioCorreo> {
    return this.api.put<{ success?: boolean; estado?: boolean; data: EnvioCorreo }>(`correos/${id}`, payload).pipe(
      map(res => res.data)
    );
  }

  eliminarCorreo(id: number): Observable<void> {
    return this.api.delete<{ success?: boolean; estado?: boolean; data: null }>(`correos/${id}`).pipe(
      map(() => undefined)
    );
  }

  enviarCorreo(id: number): Observable<any> {
    return this.api.post<{ success?: boolean; estado?: boolean; data: any }>(`correos/${id}/enviar`, {}).pipe(
      map(res => res.data)
    );
  }

  generarCorreo(payload: any): Observable<EnvioCorreo> {
    return this.api.post<{ success?: boolean; estado?: boolean; data: EnvioCorreo }>(`correos/generar`, payload).pipe(
      map(res => res.data)
    );
  }

  getBorradores(): Observable<EnvioCorreo[]> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: EnvioCorreo[] }>(`correos/borradores`).pipe(
      map(res => res.data || [])
    );
  }

  getPendientes(): Observable<EnvioCorreo[]> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: EnvioCorreo[] }>(`correos/pendientes`, undefined, { noAuth: true }).pipe(
      map(res => res.data || [])
    );
  }
}
