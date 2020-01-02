import {
  PedidoDet,
  TipoDePedido,
  FormaDePago,
  Producto,
  Corte
} from '@swrx/core-model';

export interface Cart {
  id: string | number;
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

/**
 * Interface use to manage through an angular FormGroup
 */
export interface CartFormState {
  nombre: string;
  tipo: TipoDePedido;
  formaDePago: FormaDePago;
  usoDeCfdi: string;
  cfdiMail?: string;
  sucursal: string;
}

export interface AddCartItemDto {
  producto: Partial<Producto>;
  cantidad: number;
  tipo: TipoDePedido;
}

export interface CartItemDto {
  producto: Partial<Producto>;
  cantidad: number;
  precio: number;
  corte?: Corte;
}

export class CartValidationError {
  error: string;
  descripcion: string;
}
