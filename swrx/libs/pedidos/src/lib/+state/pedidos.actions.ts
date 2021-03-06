import { createAction, props } from '@ngrx/store';
import { PedidosEntity } from './pedidos.models';
import { Pedido, PedidoAutorizacion } from '@swrx/core-model';
import { Update } from '@ngrx/entity';

export const loadPedidos = createAction('[Pedidos] Load Pedidos');
export const loadPedidosFailure = createAction(
  '[Pedidos] Load Pedidos Failure',
  props<{ error: any }>()
);
export const loadPedidosSuccess = createAction(
  '[Pedidos] Load Pedidos Success',
  props<{ pedidos: PedidosEntity[] }>()
);

export const createPedido = createAction(
  '[Shopping Cart Page] Create Pedido',
  props<{ pedido: Partial<Pedido> }>()
);
export const createPedidoFail = createAction(
  '[Pedidos API] Create Pedido fail',
  props<{ error: any }>()
);
export const createPedidoSuccess = createAction(
  '[Pedidos API] Create Pedido success',
  props<{ pedido: Pedido }>()
);

export const updatePedido = createAction(
  '[ShoppingCart Edit Page] Update Pedido',
  props<{ update: Update<Pedido> }>()
);
export const updatePedidoFail = createAction(
  '[Pedidos API] Update Pedido fail',
  props<{ error: any }>()
);
export const updatePedidoSuccess = createAction(
  '[Pedidos API] Update Pedido success',
  props<{ pedido: Pedido }>()
);

export const deletePedido = createAction(
  '[ShoppingCart Edit Page] Delete Pedido',
  props<{ pedido: Pedido }>()
);
export const deletePedidoFail = createAction(
  '[Pedidos API] Delete Pedido fail',
  props<{ error: any }>()
);
export const deletePedidoSuccess = createAction(
  '[Pedidos API] Delete Pedido success',
  props<{ pedido: Pedido }>()
);

export const cerrarPedido = createAction(
  '[Pedido Facade] Cerrar Pedido',
  props<{ pedido: Partial<Pedido> }>()
);

export const cerrarPedidoError = createAction(
  '[PedidosEffects] Cerrar pedido error',
  props<{ error: any }>()
);
export const cerrarPedidoSuccess = createAction(
  '[PedidosEffects] Cerrar pedido success',
  props<{ pedido: Pedido }>()
);

export const autorizarPedido = createAction(
  '[Pedido Facade] Autorizar Pedido',
  props<{ id: string; auth: PedidoAutorizacion }>()
);

export const autorizarPedidoError = createAction(
  '[PedidosEffects] Autorizar pedido error',
  props<{ error: any }>()
);
export const autorizarPedidoSuccess = createAction(
  '[PedidosEffects] Autorizar pedido success',
  props<{ pedido: Pedido }>()
);
