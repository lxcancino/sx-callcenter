export interface Cart {
  id: string | number;
  cliente?: any;
  nombre: string;
  rfc: string;
  fecha: string | Date;
  credito: boolean;
  formaDePago: FormaDePago;
  tipo: Tipo;
  items: any[];
  comentario: string;
  descuentos: number;
}

export interface CartItem {
  clave: string;
  descripcion: string;
  productoId: string;
  cantidad: number;
  precioCredito: number;
  precioContado: number;
  unidad: string;
  kilos: number;
  gramos: number;
  importe: number;
  impuestos: any[];
  descuento: number;
  subtotal: number;
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
