import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromCart from './cart.reducer';
import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';

import { MatDialog } from '@angular/material';
import { CartAddItemComponent } from '../cart-add-item/cart-add-item.component';

@Injectable()
export class CartFacade {
  loading$ = this.store.pipe(select(CartSelectors.getCartLoading));
  cartItems$ = this.store.pipe(select(CartSelectors.getCartItems));
  sumary$ = this.store.pipe(select(CartSelectors.getCartSumary));
  cartItemsCount$ = this.store.pipe(select(CartSelectors.getCartItemsCount));
  constructor(
    private store: Store<fromCart.CartState>,
    private dialog: MatDialog
  ) {
    this.store.pipe(select(CartSelectors.getCartSumary));
  }

  addCartItem2() {
    return this.dialog
      .open(CartAddItemComponent, {
        data: {},
        width: '750px'
      })
      .afterClosed()
      .subscribe(item => {
        if (item) {
          console.log('Add item: ', item);
        }
      });
  }

  addCartItem() {
    this.store.dispatch(CartActions.addCartItem());
  }
}
