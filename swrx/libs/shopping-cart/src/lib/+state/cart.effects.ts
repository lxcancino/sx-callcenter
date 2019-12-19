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
import { of, Observable } from 'rxjs';

import {
  notNull,
  cartState,
  reactiveCartActions,
  newItem,
  envioData
} from './cart-operators';
import { ClienteUiService } from '@swrx/clientes';
import { PedidosFacade } from '@swrx/pedidos';
import { CartItem } from './cart.models';
import { CartAddItemComponent } from '../cart-add-item/cart-add-item.component';
import { CartCheckoutComponent } from '../cart-checkout/cart-checkout.component';
import { EnvioComponent } from '../envio/envio.component';

import uuidv4 from 'uuid/v4';

@Injectable()
export class CartEffects {
  cambiarCliente$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.cambiarCliente),
      mergeMap(() => this.clienteUi.seleccionarCliente()),
      filter(cliente => !!cliente),
      map(cliente => CartActions.cambiarClienteSuccess({ cliente }))
    )
  );

  addCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addCartItem),
      cartState(this.store),
      map(([action, state]) => ({ item: action.item, tipo: state.tipo })),
      this.inDialog(CartAddItemComponent),
      notNull(),
      newItem,
      map(item => CartActions.addCartItemSuccess({ item }))
    )
  );

  editItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.editItem),
      cartState(this.store),
      map(([action, state]) => ({ item: action.item, tipo: state.tipo })),
      this.inDialog(CartAddItemComponent),
      notNull(),
      map(item => CartActions.editItemSuccess({ item }))
    )
  );

  recalcular$ = createEffect(() =>
    this.actions$.pipe(
      reactiveCartActions,
      tap(action =>
        console.log('Recalcular partidas detonado por: ', action.type)
      ),
      map(() => CartActions.recalcularPartidas())
    )
  );

  validar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.recalcularPartidas),
      map(() => CartActions.validarPedido())
    )
  );

  startCheckout$ = createEffect(() =>
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
      map(([action, state, entity]) => {
        return {
          id: state.pedido ? state.pedido.id : null,
          changes: entity
        };
      }),
      mergeMap(data =>
        this.dialog
          .open(CartCheckoutComponent, {
            data,
            width: '750px'
          })
          .afterClosed()
      ),
      filter(data => !!data),
      map(pedido => this.pedidoFacade.createOrUpdatePedido(pedido))
    )
  );

  envio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.registrarEnvio),
        envioData(this.store),
        this.inDialog(EnvioComponent),
        notNull()
        // map(pedido => this.pedidoFacade.createOrUpdatePedido(pedido))
      ),
    { dispatch: false }
  );

  // endChekout$

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private clienteUi: ClienteUiService,
    private store: Store<CartState>,
    private pedidoFacade: PedidosFacade //
  ) {}

  private inDialog(component: any) {
    return mergeMap(data => this.openDialog(component, data));
  }

  private openDialog(
    component: any,
    data: any,
    width = '750px'
  ): Observable<any> {
    return this.dialog
      .open(component, {
        data,
        width
      })
      .afterClosed();
  }
}
