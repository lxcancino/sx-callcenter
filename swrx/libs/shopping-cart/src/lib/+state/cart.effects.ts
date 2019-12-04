import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as CartActions from './cart.actions';

import { mergeMap, filter, map, tap } from 'rxjs/operators';

import { CartItem } from './cart.models';
import { CartAddItemComponent } from '../cart-add-item/cart-add-item.component';

@Injectable()
export class CartEffects {
  addCartItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addCartItem),
        mergeMap(() =>
          this.dialog
            .open(CartAddItemComponent, { data: {}, width: '750px' })
            .afterClosed()
        ),
        filter(item => !!item),
        tap((item: CartItem) => {
          if (item.corte && item.corte.cantidad) {
            const { cantidad, precio } = item.corte;
            const factor = item.unidad === 'MIL' ? 1000 : 1;
            const importe = (cantidad * precio) / factor;
            item.importeCortes = importe;
          }
        }),
        map((item: CartItem) => CartActions.addCartItemSuccess({ item }))
      ),
    { dispatch: true }
  );

  effectName$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addCartItemSuccess),
        tap(item => {
          console.log('New cart item ', item);
        })
      ),
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private dialog: MatDialog // private dataPersistence: DataPersistence<CartPartialState>
  ) {}
}
