import { createAction, props } from '@ngrx/store';
import { PedidosEntity } from './pedidos.models';
import { Pedido } from '@swrx/core-model';

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
  props<{ pedido: Pedido }>()
);
export const createPedidoFail = createAction(
  '[Pedidos API] Create Pedido fail',
  props<{ error: any }>()
);
export const createPedidoSuccess = createAction(
  '[Pedidos API] Create Pedido success',
  props<{ pedido: Pedido }>()
);
