import { createAction, props } from '@ngrx/store';
import { PedidosEntity } from './pedidos.models';
import { Pedido } from '@swrx/core-model';
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
  props<{ pedido: Update<Pedido> }>()
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


