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
import { of, EMPTY } from 'rxjs';

import { ClienteUiService } from '@swrx/clientes';
import { Pedido } from '@swrx/core-model';
import { PedidosFacade } from '@swrx/pedidos';
import { CartItem } from './cart.models';
import { CartAddItemComponent } from '../cart-add-item/cart-add-item.component';
import { CartCheckoutComponent } from '../cart-checkout/cart-checkout.component';
import { CartEditItemComponent } from '../cart-edit-item/cart-edit-item.component';

import uuidv4 from 'uuid/v4';

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

  editItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.editItem),
        concatMap(action =>
          of(action).pipe(
            withLatestFrom(this.store.pipe(select(CartSelectors.getCartState)))
          )
        ),
        mergeMap(([action, state]) =>
          this.dialog
            .open(CartEditItemComponent, {
              data: { tipo: state.tipo, item: action.item },
              width: '750px'
            })
            .afterClosed()
        ),
        tap(res => {
          console.log('Cambios: ', res);
        })
        // filter(changes => !!changes),
        // map((changes: CartItemDto) => CartActions.editItemSuccess({ changes }))
      ),
    { dispatch: false }
  );

  recalcular$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.cambiarTipo,
          CartActions.cambiarClienteSuccess,
          CartActions.addCartItemSuccess,
          CartActions.deleteItem,
          CartActions.editItemSuccess,
          CartActions.cambiarFormaDePago
        ),
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
          console.log('Recalcular partidas detonado por: ', action.type);
          return CartActions.recalcularPartidas({ items });
        })
      ),
    { dispatch: true }
  );

  validar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.recalcularPartidas),
      map(() => CartActions.validarPedido())
    )
  );

  startCheckout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.startCheckout),
        concatMap(action =>
          of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(CartSelectors.getCartState)),
              this.store.pipe(select(CartSelectors.getCartEntity))
            )
          )
        ),
        mergeMap(([action, state, entity]) =>
          this.dialog
            .open(CartCheckoutComponent, {
              data: {
                id: state.pedido ? state.pedido.id : null,
                changes: entity
              },
              width: '750px'
            })
            .afterClosed()
        ),
        filter(data => !!data),
        map(pedido => this.pedidoFacade.createOrUpdatePedido(pedido))
      ),
    { dispatch: true }
  );

  // endChekout$

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private clienteUi: ClienteUiService,
    private store: Store<CartState>,
    private pedidoFacade: PedidosFacade //
  ) {}
}
