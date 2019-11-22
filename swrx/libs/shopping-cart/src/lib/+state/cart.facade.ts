import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromCart from './cart.reducer';
import * as CartActions from './cart.actions';
import { MatDialog } from '@angular/material';
import { CartAddItemComponent } from '../cart-add-item/cart-add-item.component';
import { filter } from 'rxjs/operators';

@Injectable()
export class CartFacade {
  constructor(
    private store: Store<fromCart.CartState>,
    private dialog: MatDialog
  ) {}

  addCartItem() {
    // console.log('ADD CART ITEM...');
    // this.store.dispatch(CartActions.addCartItem());
    return this.dialog
      .open(CartAddItemComponent, {
        data: {},
        width: '700px'
      })
      .afterClosed();
    // .pipe(filter(res => !res));
  }
}
