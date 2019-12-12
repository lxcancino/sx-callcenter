import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { CartState, CartPartialState } from './cart.reducer';
import * as CartActions from './cart.actions';

import {
  mergeMap,
  filter,
  map,
  tap,
  concatMap,
  withLatestFrom
} from 'rxjs/operators';

import { PedidosFacade } from '@swrx/pedidos';
import { PedidoService } from '@swrx/pedidos';
import { CartEditPageComponent } from '../cart-edit-page/cart-edit-page.component';

import { DataPersistence } from '@nrwl/angular';

/**
 * Shopping cart effects related to the persistence store
 *
 */
@Injectable()
export class CartPersistenceEffects {
  editPedido$ = createEffect(() =>
    this.dataPersistence.navigation(CartEditPageComponent, {
      run: (a: ActivatedRouteSnapshot, state: CartPartialState) => {
        return this.pedidoService
          .get(a.params['id'])
          .pipe(map(pedido => CartActions.loadPedidoSucces({ pedido })));
      },
      onError: (a: ActivatedRouteSnapshot, e: any) => {
        console.error('Pedidos not loaded....');
        return null;
      }
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<CartState>,
    private pedidoFacade: PedidosFacade, //
    private dataPersistence: DataPersistence<CartPartialState>,
    private pedidoService: PedidoService
  ) {}
}
