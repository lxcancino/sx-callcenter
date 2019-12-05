import { createAction, props } from '@ngrx/store';
import { Cart, CartItem } from './cart.models';
import { Cliente, Pedido } from '@swrx/core-model';
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
