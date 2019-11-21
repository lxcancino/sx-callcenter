import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as CartActions from './cart.actions';
import { Cart, CartItem } from './cart.models';

export const CART_FEATURE_KEY = 'cart';

export interface CartState extends EntityState<Cart> {
  selectedId?: string | number; // which cart record has been selected
  loaded: boolean; // has the cart  been loaded
  error?: string | null; // last none error (if any)
}

export interface LayoutPartialState {
  readonly [CART_FEATURE_KEY]: CartState;
}

export const cartAdapter: EntityAdapter<Cart> = createEntityAdapter<Cart>();

export const initialState: CartState = cartAdapter.getInitialState({
  loaded: false // set initial required properties
});

const cartReducer = createReducer(
  initialState,
  on(CartActions.loadCart, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(CartActions.loadCartSuccess, (state, { cart }) =>
    cartAdapter.addOne(cart, { ...state, loaded: true })
  ),
  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(state: CartState | undefined, action: Action) {
  return cartReducer(state, action);
}
