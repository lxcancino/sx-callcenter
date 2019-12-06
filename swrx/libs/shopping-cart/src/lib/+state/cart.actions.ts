import { createAction, props } from '@ngrx/store';
import { CartItem } from './cart.models';
import {
  Cliente,
  Pedido,
  TipoDePedido,
  PedidoDet,
  FormaDePago
} from '@swrx/core-model';

export const addCartItem = createAction('[ShoppingCartPage] Add CartItem');
export const addCartItemSuccess = createAction(
  '[ShoppingCartPage] Add CartItem success',
  props<{ item: CartItem }>()
);

// Modificaciion de cliente
export const cambiarCliente = createAction(
  '[ShoppingCartPage] Cambiar cliente'
);
export const cambiarClienteError = createAction(
  '[ShoppingCartPage] Cambiar cliente error',
  props<{ error: any }>()
);
export const cambiarClienteSuccess = createAction(
  '[ShoppigCartPage] Cambiar cliente success',
  props<{ cliente: Partial<Cliente> }>()
);
export const startCheckout = createAction('[ShoppingCartPage] Start Checkout');
export const generarPedido = createAction(
  '[ShoppiongCartPage] Generar PEDIDO',
  props<{ pedido: Pedido }>()
);
export const generarPedidoFail = createAction(
  '[ShoppingCartPage] Genera PEDIDO FAIL',
  props<{ error: any }>()
);
export const generarPedidoSuccess = createAction(
  '[ShoppigCartPage] Generar PEDIDO SUCCESS',
  props<{ pedido: Pedido }>()
);

export const cambiarTipo = createAction(
  '[ShoppingCartPage] Cambiar Tipo de Pedido',
  props<{ tipo: TipoDePedido }>()
);
export const cambiarFormaDePago = createAction(
  '[ShoppingCartPage] Cambiar Forma de Pago',
  props<{ formaDePago: FormaDePago }>()
);
export const cambiarUsoDeCfdi = createAction(
  '[ShoppingCartPage] Cambiar Uso de CFDI',
  props<{ clave: string }>()
);

export const recalcularPartidas = createAction(
  '[ShoppingCart Effects] Recalcular Partidas',
  props<{ items: PedidoDet[]; descuento: number }>()
);
