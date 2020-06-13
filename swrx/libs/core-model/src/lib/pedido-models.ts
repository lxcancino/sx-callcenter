import {
  Cliente,
  ClienteCredito,
  Transporte,
  ClienteDireccion,
  Direccion
} from './core-model';
import { Producto } from './producto.models';

export interface Pedido {
  id?: string;
  fecha: string;
  sucursal: string;
  folio?: string;
  cliente: Partial<Cliente>;
  nombre: string;
  rfc: string;
  socio?: any; // Solo para los clientes de la union
  tipo: TipoDePedido;
  formaDePago: FormaDePago;
  moneda: 'MXN' | 'USD' | 'EUR';
  tipoDeCambio: number;
  partidas: Partial<PedidoDet>[];
  // Importes
  importe: number;
  descuento: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  descuentoOriginal?: number;
  descuentoEspecial?: number;
  cargosPorManiobra?: number;
  comisionTarjeta?: number;
  comisionTarjetaImporte?: number;
  corteImporte?: number;
  // Otros
  kilos: number;
  comprador?: string;
  comentario?: string;
  envio?: InstruccionDeEnvio;
  cfdiMail?: string;
  usoDeCfdi: string;
  sinExistencia?: boolean;
  chequePostFechado?: boolean;
  status: 'COTIZACION' | 'CERRADO';
  // Log
  inicio?: string;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
  autorizacion?: PedidoAutorizacion;
  autorizacionesRequeridas?: string;
  facturaSerie?: string;
  facturaFolio?: string;
  uuid?: string;
}

export interface PedidoDet {
  id?: string;
  clave: string;
  descripcion: string;
  producto: Partial<Producto>;
  unidad: string;
  presentacion?: string;
  gramos: number;
  nacional: boolean;
  modoVenta: 'B' | 'N';
  // Importes
  cantidad: number;
  precio: number;
  importe: number;
  descuento: number; // %
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  impuestoTasa: number;
  total: number;
  kilos: number;
  // Valores historicos
  precioOriginal: number;
  precioLista: number;
  descuentoOriginal: number; // % Calculado por el sistema
  descuentoEspecial?: number;
  importeCortes?: number;
  faltante?: number;

  corte?: Partial<Corte>;
  comentario?: string;
  // Bitacora
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}

export interface Corte {
  tantos: number;
  instruccion: string;
  cantidad: number;
  precio: number;
  importe: number;
  limpio: boolean;
  refinado: boolean;
}

export enum TipoDePedido {
  CONTADO = 'CON',
  CREDITO = 'CRE',
  COD = 'COD',
  POST_FECHADO = 'PSF',
  INE = 'INE'
}

export enum FormaDePago {
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  DEPOSITO_EFECTIVO = 'DEPOSITO_EFECTIVO',
  DEPOSITO_CHEQUE = 'DEPOSITO_CHEQUE',
  DEPOSITO_MIXTO = 'DEPOSITO_MIXTO',
  TARJETA_CRE = 'TARJETA_CREDITO',
  TARJETA_DEB = 'TARJETA_DEBITO',
  CHEQUE = 'CHEQUE',
  CHEQUE_PSTF = 'CHEQUE_PSTF',
  NO_DEFINIDO = 'NO_DEFINIDO'
}

export interface InstruccionDeEnvio {
  tipo: 'ENVIO' | 'FORANEO' | 'OCURRE' | 'ENVIO_CARGO';
  direccion: Direccion;
  transporte?: Partial<Transporte>;
  telefono: string;
  contacto: string;
  horario: string;
  comentario: string;
  fechaDeEntrega?: string;
  sucursal?: string;
}

export interface PedidoAutorizacion {
  sucursal: string;
  tags: string;
  comentario?: string;
  solicita: string;
  autoriza: string;
  dateCreated: string;
}

export enum TipoDeAutorizacion {
  DESCUENTO = 'DESCUENTO_ESPECIAL',
  EXISTENCIA = 'EXISTENCIA_FALTANTE'
}

export class PedidoLog {
  // Datos generales
  id: string;
  folio: number;
  nombre: string;
  fecha: string;
  sucursal: string;
  envio: boolean;
  status: string;

  // Inicio
  inicio: string;
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;

  // Cierre
  cerrado?: string;
  cerradoUser?: string;

  //Atención en sucursal
  atiende?: string;
  facturable?: string;
  facturacion?: FacturacionLog;

  // Embarque
  embarqueLog?: EmbarqueLog;
}

export interface FacturacionLog {
  serie: string;
  folio: string;

  creado: string;
  cancelado?: string;
  canceladoComentario?: string;
}

export interface EmbarqueLog {
  embarque: number;
  chofer: string;
  asignado?: Date;
  salida?: Date;
  recepcion?: RecepcionDeEnvio;
}

export interface RecepcionDeEnvio {
  arribo: Date;
  recepcion: Date;
  recibio?: string;
  comentario?: string;
}
