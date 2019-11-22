import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as CartActions from './cart.actions';
import { Cart, CartItem } from './cart.models';

export const CART_FEATURE_KEY = 'cart';

export interface CartState  {
  selectedId?: string | number; // which cart record has been selected
  error?: string | null; // last none error (if any)
  loaded: boolean;
}

export interface CartPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}

export const cartAdapter: EntityAdapter<Cart> = createEntityAdapter<Cart>();

export const initialState: CartState = {
  loaded: false // set initial required properties
};

const cartReducer = createReducer(
  initialState,
);

export function reducer(state: CartState | undefined, action: Action) {
  return cartReducer(state, action);
}
