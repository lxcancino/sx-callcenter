import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as PedidosActions from './pedidos.actions';
import { PedidosEntity } from './pedidos.models';

export const PEDIDOS_FEATURE_KEY = 'pedidos';

export interface PedidosState extends EntityState<PedidosEntity> {
  selectedId?: string | number; // which Pedidos record has been selected
  loading: boolean;
  loaded: boolean; // has the Pedidos list been loaded
  error?: string | null; // last none error (if any)
}

export interface PedidosPartialState {
  readonly [PEDIDOS_FEATURE_KEY]: PedidosState;
}

export const pedidosAdapter: EntityAdapter<PedidosEntity> = createEntityAdapter<
  PedidosEntity
>();

export const initialState: PedidosState = pedidosAdapter.getInitialState({
  // set initial required properties
  loading: true,
  loaded: false
});

const pedidosReducer = createReducer(
  initialState,
  on(PedidosActions.loadPedidos, state => ({
    ...state,
    loaded: false,
    loading: true,
    error: null
  })),
  on(PedidosActions.loadPedidosSuccess, (state, { pedidos }) => {
    return pedidosAdapter.addAll(pedidos, {
      ...state,
      loaded: true,
      loading: false
    });
  }),
  on(PedidosActions.loadPedidosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(PedidosActions.createPedido, state => ({
    ...state,
    loading: true
  })),
  on(PedidosActions.createPedidoFail, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(PedidosActions.createPedidoSuccess, (state, { pedido }) =>
    pedidosAdapter.addOne(pedido, { ...state, loading: false })
  ),
  on(PedidosActions.deletePedido, (state, { pedido }) => ({
    ...state,
    loading: true
  })),
  on(PedidosActions.deletePedidoFail, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(PedidosActions.deletePedidoSuccess, (state, { pedido }) =>
    pedidosAdapter.removeOne(pedido.id, { ...state, loading: false })
  )
);

export function reducer(state: PedidosState | undefined, action: Action) {
  return pedidosReducer(state, action);
}
