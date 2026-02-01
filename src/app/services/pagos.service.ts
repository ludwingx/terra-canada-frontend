import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import {
  Cliente,
  CuentaBancaria,
  Pago,
  PagoCliente,
  Proveedor,
  Servicio,
  TarjetaCredito,
  TipoMedioPago,
  TipoMoneda,
  Usuario,
} from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private mapCliente(c: any): Cliente {
    return {
      id: Number(c?.id),
      nombre: String(c?.nombre ?? ''),
      ubicacion: c?.ubicacion ?? undefined,
      telefono: c?.telefono ?? undefined,
      correo: c?.correo ?? undefined,
      activo: Boolean(c?.activo ?? true),
      fechaCreacion: c?.fechaCreacion ?? c?.fecha_creacion,
      fechaActualizacion: c?.fechaActualizacion ?? c?.fecha_actualizacion,
    } as Cliente;
  }

  private mapServicio(s: any): Servicio {
    return {
      id: Number(s?.id),
      nombre: String(s?.nombre ?? ''),
      descripcion: s?.descripcion ?? undefined,
      activo: Boolean(s?.activo ?? true),
      fechaCreacion: s?.fechaCreacion ?? s?.fecha_creacion,
    } as Servicio;
  }

  private mapProveedor(p: any): Proveedor {
    const servicioId = Number(p?.servicioId ?? p?.servicio_id ?? p?.servicio?.id ?? 0);
    const servicioNombre = p?.servicio?.nombre ?? p?.servicio_nombre;
    return {
      id: Number(p?.id),
      nombre: String(p?.nombre ?? ''),
      servicioId,
      servicio: servicioNombre
        ? ({ id: servicioId, nombre: String(servicioNombre) } as any)
        : p?.servicio
          ? this.mapServicio(p.servicio)
          : undefined,
      lenguaje: p?.lenguaje ?? undefined,
      telefono: p?.telefono ?? undefined,
      descripcion: p?.descripcion ?? undefined,
      activo: Boolean(p?.activo ?? true),
      correos: Array.isArray(p?.correos)
        ? p.correos.map((c: any) => ({
            id: Number(c?.id),
            proveedorId: Number(p?.id),
            correo: String(c?.correo ?? ''),
            principal: Boolean(c?.principal ?? false),
            activo: Boolean(c?.activo ?? true),
            fechaCreacion: c?.fechaCreacion ?? c?.fecha_creacion,
          }))
        : undefined,
      fechaCreacion: p?.fechaCreacion ?? p?.fecha_creacion,
      fechaActualizacion: p?.fechaActualizacion ?? p?.fecha_actualizacion,
    } as Proveedor;
  }

  private mapUsuario(u: any): Usuario {
    const rolNombre = u?.rol?.nombre ?? u?.rol_nombre ?? u?.rol;
    return {
      id: Number(u?.id),
      nombreUsuario: String(u?.nombreUsuario ?? u?.nombre_usuario ?? ''),
      correo: String(u?.correo ?? u?.email ?? ''),
      nombreCompleto: String(u?.nombreCompleto ?? u?.nombre_completo ?? ''),
      rolId: Number(u?.rolId ?? u?.rol_id ?? u?.rol?.id ?? 0),
      rol: rolNombre
        ? ({
            id: Number(u?.rol?.id ?? u?.rol_id ?? 0),
            nombre: String(rolNombre),
            descripcion: u?.rol?.descripcion,
          } as any)
        : undefined,
      telefono: u?.telefono ?? undefined,
      activo: Boolean(u?.activo ?? true),
      fechaCreacion: u?.fechaCreacion ?? u?.fecha_creacion,
      fechaActualizacion: u?.fechaActualizacion ?? u?.fecha_actualizacion,
    } as Usuario;
  }

  private mapTarjetaFromMedioPago(m: any): TarjetaCredito {
    return {
      id: Number(m?.id),
      nombreTitular: String(m?.titular ?? m?.nombre_titular ?? ''),
      ultimos4Digitos: String(m?.ultimos_digitos ?? m?.ultimos_4_digitos ?? ''),
      moneda: String(m?.moneda ?? 'CAD') as TipoMoneda,
      limiteMensual: Number(m?.limite_mensual ?? 0),
      saldoDisponible: Number(m?.saldo_disponible ?? 0),
      tipoTarjeta: m?.tipo_tarjeta ?? undefined,
      activo: true,
      fechaCreacion: m?.fechaCreacion ?? m?.fecha_creacion,
      fechaActualizacion: m?.fechaActualizacion ?? m?.fecha_actualizacion,
    } as TarjetaCredito;
  }

  private mapCuentaFromMedioPago(m: any): CuentaBancaria {
    return {
      id: Number(m?.id),
      nombreBanco: String(m?.banco ?? m?.nombre_banco ?? ''),
      nombreCuenta: String(m?.cuenta ?? m?.nombre_cuenta ?? ''),
      ultimos4Digitos: String(m?.ultimos_digitos ?? m?.ultimos_4_digitos ?? ''),
      moneda: String(m?.moneda ?? 'CAD') as TipoMoneda,
      activo: true,
      fechaCreacion: m?.fechaCreacion ?? m?.fecha_creacion,
      fechaActualizacion: m?.fechaActualizacion ?? m?.fecha_actualizacion,
    } as CuentaBancaria;
  }

  private mapPago(p: any): Pago {
    const proveedor = p?.proveedor ? this.mapProveedor(p.proveedor) : undefined;
    const usuario = p?.usuario ? this.mapUsuario(p.usuario) : undefined;
    const estados = p?.estados ?? {};
    const medioPago = p?.medio_pago || p?.medioPago;

    // Support both direct properties and nested 'estados' object
    const isPagado = Boolean(estados?.pagado ?? p?.pagado ?? false);
    const isVerificado = Boolean(estados?.verificado ?? p?.verificado ?? false);
    const isGmailEnviado = Boolean(
      estados?.gmail_enviado ?? p?.gmail_enviado ?? p?.gmailEnviado ?? false,
    );
    const isActive = Boolean(estados?.activo ?? p?.activo ?? true);

    const tipoMedioPago: TipoMedioPago = (medioPago?.tipo ??
      p?.tipo_medio_pago ??
      p?.tipoMedioPago) as TipoMedioPago;

    const clientesRaw: any[] = Array.isArray(p?.clientes) ? p.clientes : [];
    const clientes: PagoCliente[] = clientesRaw.map(
      (c: any) =>
        ({
          id: Number(c?.id ?? 0),
          pagoId: Number(p?.id),
          clienteId: Number(c?.id),
          cliente: this.mapCliente(c),
          fechaCreacion: p?.fecha_creacion || p?.fechaCreacion,
        }) as PagoCliente,
    );

    const tarjeta =
      tipoMedioPago === 'TARJETA' && medioPago
        ? this.mapTarjetaFromMedioPago(medioPago)
        : undefined;
    const cuentaBancaria =
      tipoMedioPago === 'CUENTA_BANCARIA' && medioPago
        ? this.mapCuentaFromMedioPago(medioPago)
        : undefined;

    return {
      id: Number(p?.id),
      proveedorId: Number(proveedor?.id ?? p?.proveedor_id ?? 0),
      proveedor,
      usuarioId: Number(usuario?.id ?? p?.usuario_id ?? 0),
      usuario,
      codigoReserva: String(p?.codigo_reserva ?? p?.codigoReserva ?? ''),
      monto: Number(p?.monto ?? 0),
      moneda: String(p?.moneda ?? 'CAD') as TipoMoneda,
      descripcion: p?.descripcion ?? undefined,
      fechaEsperadaDebito: p?.fecha_esperada_debito
        ? new Date(p.fecha_esperada_debito)
        : p?.fechaEsperadaDebito
          ? new Date(p.fechaEsperadaDebito)
          : undefined,
      tipoMedioPago,
      tarjetaId: tarjeta?.id,
      tarjeta,
      cuentaBancariaId: cuentaBancaria?.id,
      cuentaBancaria,
      pagado: isPagado,
      verificado: isVerificado,
      gmailEnviado: isGmailEnviado,
      activo: isActive,
      fechaPago: p?.fecha_pago
        ? new Date(p.fecha_pago)
        : p?.fechaPago
          ? new Date(p.fechaPago)
          : undefined,
      fechaVerificacion: p?.fecha_verificacion
        ? new Date(p.fecha_verificacion)
        : p?.fechaVerificacion
          ? new Date(p.fechaVerificacion)
          : undefined,
      clientes,
      fechaCreacion: p?.fecha_creacion
        ? new Date(p.fecha_creacion)
        : p?.fechaCreacion
          ? new Date(p.fechaCreacion)
          : new Date(),
      fechaActualizacion: p?.fecha_actualizacion
        ? new Date(p.fecha_actualizacion)
        : p?.fechaActualizacion
          ? new Date(p.fechaActualizacion)
          : new Date(),
    } as Pago;
  }

  private getUsuarioIdForAudit(payload?: any): number | undefined {
    const explicit = payload?.usuario_id ?? payload?.usuarioId;
    if (typeof explicit === 'number' && !Number.isNaN(explicit)) return explicit;
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.id;
  }

  getPagos(filters?: any): Observable<Pago[]> {
    console.log('GET Pagos filters:', filters);
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`pagos`, filters).pipe(
      tap((res) => console.log('GET Pagos response:', res)),
      map((res) => {
        const rawData = res.data?.data || res.data || [];
        return (Array.isArray(rawData) ? rawData : []).map((p) => this.mapPago(p));
      }),
    );
  }

  getPago(id: number): Observable<Pago> {
    return this.api.get<{ success?: boolean; estado?: boolean; data: any }>(`pagos/${id}`).pipe(
      tap((res) => console.log(`GET Pago ${id} response:`, res)),
      map((res) => this.mapPago(res.data?.data || res.data)),
    );
  }

  createPago(pago: any): Observable<Pago> {
    const payload = {
      codigo_reserva: pago.codigoReserva || pago.codigo_reserva,
      proveedor_id: Number(pago.proveedorId || pago.proveedor_id),
      monto: Number(pago.monto),
      moneda: pago.moneda,
      tipo_medio_pago: pago.tipoMedioPago || pago.tipo_medio_pago,
      tarjeta_id: pago.tarjetaId || pago.tarjeta_id || null,
      cuenta_bancaria_id: pago.cuentaBancariaId || pago.cuenta_bancaria_id || null,
      descripcion: pago.descripcion || null,
      fecha_esperada_debito: pago.fechaEsperadaDebito || pago.fecha_esperada_debito || null,
      clientes_ids: Array.isArray(pago.clientesIds) ? pago.clientesIds : pago.clientes_ids || [],
      usuario_id: this.getUsuarioIdForAudit(pago),
    };
    console.log('POST Pago payload:', payload);

    return this.api.post<{ success: boolean; data: any }>(`pagos`, payload).pipe(
      tap((res) => console.log('POST Pago response:', res)),
      map((res) => this.mapPago(res.data?.data || res.data)),
    );
  }

  updatePago(id: number, pago: any): Observable<Pago> {
    const payload: any = {
      usuario_id: this.getUsuarioIdForAudit(pago),
    };

    if (pago.monto !== undefined) payload.monto = Number(pago.monto);
    if (pago.descripcion !== undefined) payload.descripcion = pago.descripcion;
    if (pago.fechaEsperadaDebito !== undefined || pago.fecha_esperada_debito !== undefined)
      payload.fecha_esperada_debito = pago.fechaEsperadaDebito ?? pago.fecha_esperada_debito;

    if (pago.pagado !== undefined) payload.pagado = Boolean(pago.pagado);
    if (pago.verificado !== undefined) payload.verificado = Boolean(pago.verificado);
    if (pago.gmailEnviado !== undefined || pago.gmail_enviado !== undefined)
      payload.gmail_enviado = Boolean(pago.gmailEnviado ?? pago.gmail_enviado);
    if (pago.activo !== undefined) payload.activo = Boolean(pago.activo);

    console.log(`PUT Pago ${id} payload:`, payload);

    return this.api.put<{ success: boolean; data: any }>(`pagos/${id}`, payload).pipe(
      tap((res) => console.log(`PUT Pago ${id} response:`, res)),
      map((res) => this.mapPago(res.data?.data || res.data)),
    );
  }

  cancelarPago(id: number): Observable<void> {
    const usuario_id = this.getUsuarioIdForAudit();
    const params = usuario_id ? { usuario_id } : {};
    console.log(`DELETE Pago ${id} params:`, params);
    return this.api.delete<{ success: boolean; data: null }>(`pagos/${id}`, params).pipe(
      tap((res) => console.log(`DELETE Pago ${id} response:`, res)),
      map(() => undefined),
    );
  }

  // Scan and upload endpoints corrected to match backend routes
  enviarDocumentoEstado(pdf: string, idPago: number): Observable<any> {
    const payload = {
      pdf,
      id_pago: idPago,
      usuario_id: this.getUsuarioIdForAudit(),
    };
    console.log('POST Pago documento-estado payload:', payload);
    return this.api
      .post<{ success: boolean; mensaje: string }>(`pagos/documento-estado`, payload)
      .pipe(tap((res) => console.log('POST Pago documento-estado response:', res)));
  }

  subirFacturas(facturas: any[]): Observable<any> {
    const payload = {
      modulo: 'factura',
      usuario_id: this.getUsuarioIdForAudit(),
      facturas: facturas.map((f) => ({
        pdf: f.pdf,
        proveedor_id: f.proveedorId || f.proveedor_id,
      })),
    };
    console.log('POST Pago subir-facturas payload:', payload);
    return this.api
      .post<{ success: boolean; mensaje: string }>(`pagos/subir-facturas`, payload)
      .pipe(tap((res) => console.log('POST Pago subir-facturas response:', res)));
  }

  subirExtractoBanco(pdf: string): Observable<any> {
    const payload = {
      pdf,
      usuario_id: this.getUsuarioIdForAudit(),
    };
    console.log('POST Pago subir-extracto-banco payload:', payload);
    return this.api
      .post<{ success: boolean; mensaje: string }>(`pagos/subir-extracto-banco`, payload)
      .pipe(tap((res) => console.log('POST Pago subir-extracto-banco response:', res)));
  }
}
