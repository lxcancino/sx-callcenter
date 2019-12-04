import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as CartActions from './cart.actions';
import { Cart, CartItem } from './cart.models';

import { DemoItems } from './cart-state-demo';

import keyBy from 'lodash/keyBy';
import uuidv4 from 'uuid/v4';

export const CART_FEATURE_KEY = 'cart';

export interface CartState {
  selectedId?: string | number; // which cart record has been selected
  error?: string | null; // last none error (if any)
  loading: boolean;
  items: { [id: string]: CartItem };
}

export interface CartPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}

export const initialState: CartState = {
  loading: false,
  items: keyBy([...DemoItems.slice(2, 3)], 'id')
};

const cartReducer = createReducer(
  initialState,
  on(CartActions.addCartItemSuccess, (state, { item }) => ({
    ...state,
    items: { ...state.items, [item.id || uuidv4()]: item },
    loading: false
  }))
);

export function reducer(state: CartState | undefined, action: Action) {
  return cartReducer(state, action);
}
