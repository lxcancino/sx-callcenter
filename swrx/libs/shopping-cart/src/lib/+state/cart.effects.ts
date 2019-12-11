import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Store, select } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { CartState } from './cart.reducer';
import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';
import { PedidosFacade } from '@swrx/pedidos';

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
import { Pedido } from '@swrx/core-model';

@Injectable()
export class CartEffects {
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
          if (item.corte && item.corte.cantidad > 0) {
            const { cantidad, precio } = item.corte;
            const importe = cantidad * precio;
            item.importeCortes = importe;
          }
        }),
        map((item: CartItem) => CartActions.addCartItemSuccess({ item }))
      ),
    { dispatch: true }
  );

  cambiarTipo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.cambiarTipo, CartActions.cambiarClienteSuccess),
        concatMap(action =>
          of(action).pipe(
            withLatestFrom(this.store.pipe(select(CartSelectors.getCartItems)))
          )
        ),
        map(([action, items]) => {
          return CartActions.recalcularPartidas({ items });
        })
      ),
    { dispatch: true }
  );

  cambiarFormaDePago$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.cambiarFormaDePago),
        concatMap(action =>
          of(action).pipe(
            withLatestFrom(this.store.pipe(select(CartSelectors.getCartItems)))
          )
        ),
        tap(([action, items]) => console.log('Cambiando forma de pago........'))
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
        map(([action, state, items]) => {
          return CartActions.recalcularPartidas({ items });
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
        map(pedido => this.pedidoFacade.createPedido(pedido))
      ),
    { dispatch: true }
  );
  constructor(
    private actions$: Actions,
    private dialog: MatDialog, // private dataPersistence: DataPersistence<CartPartialState>
    private clienteUi: ClienteUiService,
    private store: Store<CartState>,
    private pedidoFacade: PedidosFacade
  ) {}
}
