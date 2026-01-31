import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { EnvioCorreo } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CorreosService {
  private api = inject(ApiService);
  
  private mapCorreo(c: any): EnvioCorreo {
    return {
      id: Number(c.id),
      proveedorId: Number(c.proveedor_id ?? c.proveedorId ?? 0),
      proveedor: c.proveedor ? c.proveedor : (c.proveedor_nombre ? { nombre: String(c.proveedor_nombre) } : undefined),
      correoSeleccionado: String(c.correo_seleccionado ?? c.correoSeleccionado ?? ''),
      usuarioEnvioId: Number(c.usuario_envio_id ?? c.usuarioEnvioId ?? 0),
      usuarioEnvio: c.usuarioEnvio || (c.usuario_nombre ? { nombreCompleto: String(c.usuario_nombre) } : undefined),
      asunto: String(c.asunto ?? ''),
      cuerpo: String(c.cuerpo ?? ''),
      estado: c.estado,
      cantidadPagos: Number(c.cantidad_pagos ?? c.cantidadPagos ?? 0),
      montoTotal: Number(c.monto_total ?? c.montoTotal ?? 0),
      fechaGeneracion: c.fecha_generacion ?? c.fechaGeneracion,
      fechaEnvio: c.fecha_envio ?? c.fechaEnvio,
      detalles: Array.isArray(c.detalles) ? c.detalles : undefined
    } as EnvioCorreo;
  }

  getCorreos(): Observable<EnvioCorreo[]> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`correos`).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map(c => this.mapCorreo(c));
      })
    );
  }

  getCorreo(id: number): Observable<EnvioCorreo> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`correos/${id}`).pipe(
      map(res => this.mapCorreo(res.data?.data || res.data))
    );
  }

  crearCorreoManual(payload: any): Observable<EnvioCorreo> {
    return this.api.post<{ success?: boolean; estado?: boolean; data: any }>(`correos`, payload).pipe(
      map(res => this.mapCorreo(res.data?.data || res.data))
    );
  }

  actualizarCorreo(id: number, payload: any): Observable<EnvioCorreo> {
    return this.api.put<{ success?: boolean; estado?: boolean; data: any }>(`correos/${id}`, payload).pipe(
      map(res => this.mapCorreo(res.data?.data || res.data))
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
    return this.api.post<{ success?: boolean; estado?: boolean; data: any }>(`correos/generar`, payload).pipe(
      map(res => this.mapCorreo(res.data?.data || res.data))
    );
  }

  getBorradores(): Observable<EnvioCorreo[]> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`correos/borradores`).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map(c => this.mapCorreo(c));
      })
    );
  }

  getPendientes(): Observable<EnvioCorreo[]> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`correos/pendientes`).pipe(
      map(res => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map(c => this.mapCorreo(c));
      })
    );
  }
}
