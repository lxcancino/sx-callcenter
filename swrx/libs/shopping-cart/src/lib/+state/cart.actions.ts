import { createAction, props } from '@ngrx/store';
import { CartItem, CartItemDto } from './cart.models';
import {
  Cliente,
  Pedido,
  TipoDePedido,
  PedidoDet,
  FormaDePago,
  InstruccionDeEnvio
} from '@swrx/core-model';

export const addCartItem = createAction('[ShoppingCartPage] Add CartItem');
export const addCartItemSuccess = createAction(
  '[ShoppingCartPage] Add CartItem success',
  props<{ item: CartItem }>()
);
export const deleteItem = createAction(
  '[CartListComponent] Delete item',
  props<{ item: Partial<CartItem> }>()
);
export const editItem = createAction(
  '[CartListComponent] Edit CartItem',
  props<{ item: CartItem }>()
);
export const editItemSuccess = createAction(
  '[CartEffects] Edit CartItem Success',
  props<{ item: Partial<CartItem> }>()
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
  props<{ items: PedidoDet[] }>()
);
export const startCheckout = createAction('[ShoppingCartPage] Start Checkout');

export const loadPedidoSucces = createAction(
  '[CartEffects] Load pedido success',
  props<{ pedido: Pedido }>()
);

export const cleanShoppingCart = createAction(
  '[NewCartGuard] Clea shopping cart state'
);

export const validarPedido = createAction('[CartEffects] Validar Pedido');

export const registrarEnvio = createAction('[CartEffects] Registrar envio');
export const registrarEnvioSuccess = createAction(
  '[CartEffects] Registrar envio success',
  props<{ envio: InstruccionDeEnvio }>()
);
