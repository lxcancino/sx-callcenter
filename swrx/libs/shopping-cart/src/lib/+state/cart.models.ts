import { PedidoDet } from '@swrx/core-model';

export interface Cart {
  id: string | number;
  cliente?: any;
  nombre: string;
  rfc: string;
  fecha: string | Date;
  credito: boolean;
  formaDePago: FormaDePago;
  tipo: Tipo;
  usoDeCfdi: string;
  partidas: CartItem[];
  comentario: string;
  importe: number;
  descuento: number;
  descuentImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  kilos: number;
}

export interface CartItem extends PedidoDet {
  itemId?: string | number;
}

export interface CartSumary {
  importe: number;
  descuento: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
}

export enum FormaDePago {
  EFECTIVO = 'EFECTIVO',
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  CHEQUE = 'CHEQUE',
  NO_DEFINIDO = 'NO_DEFINIDO' // Para Ventas a credito
}
export enum Tipo {
  CON,
  COD,
  CRE
}
