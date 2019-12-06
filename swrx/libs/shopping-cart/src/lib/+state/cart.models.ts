import { PedidoDet, TipoDePedido, FormaDePago } from '@swrx/core-model';

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
  tipo: TipoDePedido,
  formaDePago: FormaDePago,
  usoDeCfdi: string
}
