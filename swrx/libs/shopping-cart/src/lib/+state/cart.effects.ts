import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { CartState } from './cart.reducer';
import * as CartActions from './cart.actions';

import { mergeMap, filter, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import {
  notNull,
  cartState,
  reactiveCartActions,
  newItem,
  envioState,
  pedidoState
} from './cart-operators';
import { ClienteUiService } from '@swrx/clientes';
import { PedidosFacade } from '@swrx/pedidos';

import { CartAddItemComponent } from '../cart-add-item/cart-add-item.component';
import { CartCheckoutComponent } from '../cart-checkout/cart-checkout.component';
import { EnvioComponent } from '../envio/envio.component';
import { InstruccionDeEnvio } from '@swrx/core-model';
import { CartNombreComponent } from '../cart-nombre/cart-nombre.component';

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
  cambiarNombre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.cambiarNombre),
      cartState(this.store),
      map(([action, state]) => ({ nombre: state.nombre })),
      this.inDialog(CartNombreComponent),
      filter(nombre => !!nombre),
      map(nombre => CartActions.cambiarNombreSuccess({ nombre }))
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
      pedidoState(this.store),
      this.inDialog(CartCheckoutComponent),
      notNull(),
      map((data: any) =>
        this.pedidoFacade.createOrUpdatePedido({
          id: data.id,
          changes: data.changes
        })
      )
    )
  );

  envio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.registrarEnvio),
      envioState(this.store),
      this.inDialog(EnvioComponent),
      notNull(),
      map((envio: InstruccionDeEnvio) =>
        CartActions.registrarEnvioSuccess({ envio })
      )
    )
  );

  loadPedidoSucces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadPedidoSucces),
      map(() => CartActions.validarPedido())
    )
  );

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
