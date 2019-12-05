import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromCart from './cart.reducer';
import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';

@Injectable()
export class CartFacade {
  loading$ = this.store.pipe(select(CartSelectors.getCartLoading));
  cartItems$ = this.store.pipe(select(CartSelectors.getCartItems));
  sumary$ = this.store.pipe(select(CartSelectors.getCartSumary));
  cartItemsCount$ = this.store.pipe(select(CartSelectors.getCartItemsCount));
  cliente$ = this.store.pipe(select(CartSelectors.getCliente));
  constructor(private store: Store<fromCart.CartState>) {
    this.store.pipe(select(CartSelectors.getCartSumary));
  }

  addCartItem() {
    this.store.dispatch(CartActions.addCartItem());
  }

  cambiarCliente() {
    this.store.dispatch(CartActions.cambiarCliente());
  }
  startCheckout() {
    this.store.dispatch(CartActions.startCheckout());
  }
}
