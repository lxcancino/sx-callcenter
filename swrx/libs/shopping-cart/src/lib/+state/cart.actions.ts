import { createAction, props } from '@ngrx/store';
import { Cart } from './cart.models';

export const loadCart = createAction('[ShoppinCartPage] Load Cart');

export const loadCartSuccess = createAction(
  '[ShoppingCart] Load Cart Success',
  props<{ cart: Cart }>()
);

export const loadCartFailure = createAction(
  '[ShoppingCart] Load Cart Failure',
  props<{ error: any }>()
);
