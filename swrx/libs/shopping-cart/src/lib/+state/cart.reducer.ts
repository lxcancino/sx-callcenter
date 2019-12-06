import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as CartActions from './cart.actions';
import { CartItem } from './cart.models';

import { clienteMostrador, aplicarDescuentos } from './cart.utils';
import { Cliente, TipoDePedido, PedidoDet } from '@swrx/core-model';

import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import forIn from 'lodash/forIn';

export const CART_FEATURE_KEY = 'cart';

export interface CartState {
  selectedId?: string | number; // which cart record has been selected
  error?: string | null; // last none error (if any)
  loading: boolean;
  cliente: Partial<Cliente>;
  tipo: TipoDePedido;
  items: { [id: string]: CartItem };
}

export interface CartPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}

export const initialState: CartState = {
  loading: false,
  cliente: clienteMostrador(),
  tipo: TipoDePedido.CONTADO,
  items: keyBy([], 'id')
};

const cartReducer = createReducer(
  initialState,
  on(CartActions.addCartItemSuccess, (state, { item }) => ({
    ...state,
    items: { ...state.items, [item.id]: item },
    loading: false
  })),
  on(CartActions.cambiarClienteSuccess, (state, { cliente }) => ({
    ...state,
    cliente
  })),
  on(CartActions.cambiarClienteError, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CartActions.cambiarTipo, (state, { tipo }) => ({ ...state, tipo })),
  on(CartActions.recalcularPartidas, (state, { descuento }) => {
    const partidas = values(state.items)
    const items = keyBy(aplicarDescuentos(partidas, state.tipo, descuento), 'id');
    return { ...state, items };
  })
);

export function reducer(state: CartState | undefined, action: Action) {
  return cartReducer(state, action);
}
