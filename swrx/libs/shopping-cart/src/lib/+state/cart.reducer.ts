import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as CartActions from './cart.actions';
import { Cart, CartItem } from './cart.models';

import { DemoItems } from './cart-state-demo';
import { clienteMostrador } from './cart.utils';

import keyBy from 'lodash/keyBy';

import { Cliente } from '@swrx/core-model';

export const CART_FEATURE_KEY = 'cart';

export interface CartState {
  selectedId?: string | number; // which cart record has been selected
  error?: string | null; // last none error (if any)
  loading: boolean;
  cliente: Partial<Cliente>;
  tipo: 'CREDITO' | 'CONTADO' | 'COD';
  items: { [id: string]: CartItem };
}

export interface CartPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}

export const initialState: CartState = {
  loading: false,
  cliente: clienteMostrador(),
  tipo: 'CONTADO',
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
  }))
);

export function reducer(state: CartState | undefined, action: Action) {
  return cartReducer(state, action);
}
