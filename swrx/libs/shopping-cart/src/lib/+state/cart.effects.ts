import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
// import { DataPersistence } from '@nrwl/angular';

import { CartPartialState } from './cart.reducer';
import * as CartActions from './cart.actions';
import { tap, mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { CartAddItemComponent } from '../cart-add-item/cart-add-item.component';

@Injectable()
export class CartEffects {
  addCartItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addCartItem),
        mergeMap(() =>
          this.dialog
            .open(CartAddItemComponent, { data: {}, width: '550px' })
            .afterClosed()
        ),
        tap(res => {
          // console.log('Adding Item to the cart.....');
          // this.dialog.open(CartAddItemComponent, { data: {} });
          console.log('Res: ', res);
        })
      ),
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private dialog: MatDialog // private dataPersistence: DataPersistence<CartPartialState>
  ) {}
}
