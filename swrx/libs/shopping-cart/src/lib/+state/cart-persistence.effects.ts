import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { CartPartialState, CART_FEATURE_KEY } from './cart.reducer';
import * as CartActions from './cart.actions';
import {
  createPedidoSuccess,
  cerrarPedidoSuccess,
  updatePedidoSuccess,
  autorizarPedidoSuccess,
  deletePedidoSuccess
} from '@swrx/pedidos';

import { of, empty } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { PedidoService } from '@swrx/pedidos';
import { CartEditPageComponent } from '../cart-edit-page/cart-edit-page.component';

import { DataPersistence } from '@nrwl/angular';

/**
 * Shopping  persistence and navigation effects
 *
 */
@Injectable()
export class CartPersistenceEffects {
  editPedido$ = createEffect(() =>
    this.dataPersistence.navigation(CartEditPageComponent, {
      run: (a: ActivatedRouteSnapshot, state: CartPartialState) => {
        if (
          state[CART_FEATURE_KEY].pedido &&
          state[CART_FEATURE_KEY].pedido.id === a.params['id']
        ) {
          return of();
        } else {
          return this.pedidoService.get(a.params['id']).pipe(
            tap(pedido => console.log('Cargando para editar pedido: ', pedido)),
            map(pedido => CartActions.loadPedidoSucces({ pedido }))
          );
        }
      },
      onError: (a: ActivatedRouteSnapshot, e: any) => {
        console.error('Pedidos not loaded....');
        return null;
      }
    })
  );

  saveOrUpdateCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createPedidoSuccess, updatePedidoSuccess),
        tap(action => {
          // console.log('Pedido persistido: ', action.pedido);
          // this.router.navigate(['/shop/cart', action.pedido.id]);
          this.router.navigate(['/pedidos']);
        }),
        map(() => CartActions.cleanShoppingCart())
      ),
    { dispatch: true }
  );

  cerrarPedidoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(cerrarPedidoSuccess),
        tap(action => {
          // console.log('Pedido persistido: ', action.pedido);
          // this.router.navigate(['/shop/cart', action.pedido.id]);
          this.router.navigate(['/pedidos']);
        }),
        map(() => CartActions.cleanShoppingCart())
      ),
    { dispatch: true }
  );

  deletePedidoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deletePedidoSuccess),
        tap(action => {
          // console.log('Pedido persistido: ', action.pedido);
          // this.router.navigate(['/shop/cart', action.pedido.id]);
          this.router.navigate(['/pedidos']);
        }),
        map(() => CartActions.cleanShoppingCart())
      ),
    { dispatch: true }
  );

  autorizarPedidoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(autorizarPedidoSuccess),
        tap(action => {
          this.router.navigate(['/pedidos']);
        }),
        map(() => CartActions.cleanShoppingCart())
      ),
    { dispatch: true }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<CartPartialState>,
    private pedidoService: PedidoService,
    private router: Router
  ) {}
}
