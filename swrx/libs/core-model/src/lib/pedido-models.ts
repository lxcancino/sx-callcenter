import { Cliente } from './core-model';

export interface Pedido {
  id?: string | number;
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
  partidas: PedidoDet[];
  // Importes
  importe: number;
  descuento: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  descuentoOriginal?: number;
  cargosPorManiobra?: number;
  comisionTarjeta?: number;
  comisionTarjetaImporte?: number;
  corteImporte?: number;
  // Otros
  kilos: number;
  comprador?: string;
  comentario?: string;
  envio?: any;
  cfdiMail?: string;
  usoDeCfdi: string;
  sinExistencia?: boolean;
  chequePostFechado?: boolean;

  // Log
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}

export interface PedidoDet {
  id: string | number;
  clave: string;
  descripcion: string;
  producto: {
    id: string;
    clave: string;
    descripcion: string;
    modoVenta: string;
    imageUrl: string;
    precioCredito: number;
    precioContado: number;
  };
  unidad: string;
  presentacion?: string;
  gramos: number;
  nacional: boolean;
  modoVenta: string;
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
  importeCortes?: number;

  corte?: Partial<Corte>;
  comentario?: string;
  // Bitacora
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}

export interface Corte {
  cantidad: number;
  instruccion: string;
  precio: number;
  limptio: boolean;
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
  TRANSFERENCIA = 'TRANSFERENCIA',
  DEPOSITO = 'DEPOSITO',
  EFECTIVO = 'EFECTIVO',
  TARJETA_CRE = 'TARJETA_CREDITO',
  TARJETA_DEB = 'TARJETA_DEBITO',
  CHEQUE = 'CHEQUE',
  NO_DEFINIDO = 'NO_DEFINIDO'
}
