import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Store, select } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { CartState } from './cart.reducer';
import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';

import {
  mergeMap,
  filter,
  map,
  tap,
  concatMap,
  withLatestFrom
} from 'rxjs/operators';
import { of } from 'rxjs';

import { CartItem } from './cart.models';
import { CartAddItemComponent } from '../cart-add-item/cart-add-item.component';
import { ClienteUiService } from '@swrx/clientes';

import uuidv4 from 'uuid/v4';
import { CartCheckoutComponent } from '../cart-checkout/cart-checkout.component';
import { Pedido, PedidoDet } from '@swrx/core-model';
import { recalculaPartida } from './cart.utils';

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
          item.id = uuidv4();
          if (item.corte && item.corte.cantidad && item.corte.cantidad > 0) {
            const { cantidad, precio } = item.corte;
            const importe = cantidad * precio;
            item.importeCortes = importe;
          }
        }),
        map((item: CartItem) => CartActions.addCartItemSuccess({ item }))
      ),
    { dispatch: true }
  );

  cambiarCliente$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.cambiarCliente),
        mergeMap(() => this.clienteUi.seleccionarCliente()),
        filter(cliente => !!cliente),
        map(cliente => CartActions.cambiarClienteSuccess({ cliente }))
      ),
    { dispatch: true }
  );

  addItemSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addCartItemSuccess),
        tap(item => {
          console.log('New cart item ', item);
        })
        // map(() => CartActions.recalcularPartidas())
      ),
    { dispatch: false }
  );

  recalcular$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addCartItemSuccess),
        concatMap(action =>
          of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(CartSelectors.getCartState)),
              this.store.pipe(select(CartSelectors.getCartItems)),
              this.store.pipe(select(CartSelectors.getDescuento))
            )
          )
        ),
        // tap(([action, state, items, descuento]) =>
        //   console.log(
        //     `Recalculando importes para ${items.length} partidas tipo ${state.tipo} Descto: ${descuento}% Cliente: ${state.cliente.nombre}`
        //   )
        // ),
        map(([action, state, items, descuento]) => {
          return CartActions.recalcularPartidas({ items, descuento });
        })
      ),
    { dispatch: true }
  );

  startCheckout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.startCheckout),
        concatMap(action =>
          of(action).pipe(
            withLatestFrom(this.store.pipe(select(CartSelectors.getCartEntity)))
          )
        ),
        mergeMap(([action, entity]) =>
          this.dialog
            .open(CartCheckoutComponent, { data: { entity }, width: '750px' })
            .afterClosed()
        ),
        filter(entity => !!entity),
        map(entity => {
          const pedido: Pedido = {
            ...entity
          };
          return pedido;
        }),
        tap(pedido => console.log('Salvando pedido: ', pedido)),
        map(pedido => CartActions.generarPedido({ pedido }))
      ),
    { dispatch: true }
  );
  constructor(
    private actions$: Actions,
    private dialog: MatDialog, // private dataPersistence: DataPersistence<CartPartialState>
    private clienteUi: ClienteUiService,
    private store: Store<CartState>
  ) {}
}
