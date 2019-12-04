import { createAction, props } from '@ngrx/store';
import { Cart, CartItem } from './cart.models';
export const addCartItem = createAction('[ShoppingCartPage] Add CartItem');
export const addCartItemSuccess = createAction(
  '[ShoppingCartPage] Add CartItem success',props<{item: CartItem}>()
);
