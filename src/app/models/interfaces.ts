// Interfaces para el Sistema de Gestión de Pagos Terra Canada

// Enums
export type TipoMoneda = 'USD' | 'CAD';
export type TipoMedioPago = 'TARJETA' | 'CUENTA_BANCARIA';
export type TipoDocumento = 'FACTURA' | 'DOCUMENTO_BANCO';
export type EstadoCorreo = 'BORRADOR' | 'ENVIADO';
export type TipoEvento = 'INICIO_SESION' | 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR' | 'VERIFICAR_PAGO' | 'CARGAR_TARJETA' | 'ENVIAR_CORREO' | 'SUBIR_DOCUMENTO' | 'RESET_MENSUAL';
export type RolUsuario = 'ADMIN' | 'SUPERVISOR' | 'EQUIPO';

// Interfaces principales
export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaCreacion: Date;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion: Date;
}

export interface Usuario {
  id: number;
  nombreUsuario: string;
  correo: string;
  nombreCompleto: string;
  rolId: number;
  rol?: Rol;
  telefono?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Proveedor {
  id: number;
  nombre: string;
  servicioId: number;
  servicio?: Servicio;
  lenguaje?: string;
  telefono?: string;
  descripcion?: string;
  activo: boolean;
  correos?: ProveedorCorreo[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface ProveedorCorreo {
  id: number;
  proveedorId: number;
  correo: string;
  principal: boolean;
  activo: boolean;
  fechaCreacion: Date;
}

export interface Cliente {
  id: number;
  nombre: string;
  ubicacion?: string;
  telefono?: string;
  correo?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface TarjetaCredito {
  id: number;
  nombreTitular: string;
  ultimos4Digitos: string;
  moneda: TipoMoneda;
  limiteMensual: number;
  saldoDisponible: number;
  tipoTarjeta?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CuentaBancaria {
  id: number;
  nombreBanco: string;
  nombreCuenta: string;
  ultimos4Digitos: string;
  moneda: TipoMoneda;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Pago {
  id: number;
  proveedorId: number;
  proveedor?: Proveedor;
  usuarioId: number;
  usuario?: Usuario;
  codigoReserva: string;
  monto: number;
  moneda: TipoMoneda;
  descripcion?: string;
  fechaEsperadaDebito?: Date;
  tipoMedioPago: TipoMedioPago;
  tarjetaId?: number;
  tarjeta?: TarjetaCredito;
  cuentaBancariaId?: number;
  cuentaBancaria?: CuentaBancaria;
  pagado: boolean;
  verificado: boolean;
  gmailEnviado: boolean;
  activo: boolean;
  fechaPago?: Date;
  fechaVerificacion?: Date;
  clientes?: PagoCliente[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface PagoCliente {
  id: number;
  pagoId: number;
  clienteId: number;
  cliente?: Cliente;
  fechaCreacion: Date;
}

export interface Documento {
  id: number;
  usuarioId: number;
  usuario?: Usuario;
  pagoId?: number;
  pago?: Pago;
  nombreArchivo: string;
  urlDocumento: string;
  tipoDocumento: TipoDocumento;
  fechaSubida: Date;
}

export interface EnvioCorreo {
  id: number;
  proveedorId: number;
  proveedor?: Proveedor;
  correoSeleccionado: string;
  usuarioEnvioId: number;
  usuarioEnvio?: Usuario;
  asunto: string;
  cuerpo: string;
  estado: EstadoCorreo;
  cantidadPagos: number;
  montoTotal: number;
  fechaGeneracion: Date;
  fechaEnvio?: Date;
  detalles?: EnvioCorreoDetalle[];
}

export interface EnvioCorreoDetalle {
  id: number;
  envioId: number;
  pagoId: number;
  pago?: Pago;
  fechaCreacion: Date;
}

export interface Evento {
  id: number;
  usuarioId?: number;
  usuario?: Usuario;
  tipoEvento: TipoEvento;
  entidadTipo: string;
  entidadId?: number;
  descripcion: string;
  ipOrigen?: string;
  userAgent?: string;
  fechaEvento: Date;
}

// Interfaces para Dashboard / KPIs
export interface DashboardKPIs {
  pagosPendientes: number;
  pagosPagados: number;
  pagosVerificados: number;
  correosPendientes: number;
  correosEnviados: number;
  montoTotalMes: number;
  montoTarjetas: number;
  montoCuentas: number;
}

export interface TopProveedor {
  proveedor: Proveedor;
  cantidadPagos: number;
  montoTotal: number;
}

// Interfaces para navegación
// Interfaces para navegación
export interface MenuItem {
  id: string;
  label: string;
  labelFr?: string; // Optional if not used by reference but kept for compatibility
  icon: string;
  route: string;
  roles?: RolUsuario[]; // Keep for compatibility
  children?: MenuItem[];
  translationKey?: string; // Added from reference
  badge?: number; // Added from reference
}

export interface StatCard {
  id: string;
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: number;
  trendDirection?: 'up' | 'down';
  unit?: string;
}

export interface Activity {
  id: string;
  date: string;
  time: string;
  user: string; // Proveedor
  client?: string; // Nuevo: cliente asociado al pago
  action: string;
  amount?: number;
  currency?: string;
  paymentStatus?: 'PAGADO' | 'POR_PAGAR' | string; // Nuevo: estado de pago
  verified?: boolean; // Nuevo: flag de verificación cruda
  status: 'completado' | 'sin-verificacion'; // Mantiene estado derivado para compatibilidad
}

