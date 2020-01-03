import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { CartPartialState } from './cart.reducer';
import * as CartActions from './cart.actions';
import {
  createPedidoSuccess,
  cerrarPedidoSuccess,
  updatePedidoSuccess
} from '@swrx/pedidos';

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
        return this.pedidoService.get(a.params['id']).pipe(
          tap(pedido => console.log('Editando pedido: ', pedido)),
          map(pedido => CartActions.loadPedidoSucces({ pedido }))
        );
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
        })
      ),
    { dispatch: false }
  );

  cerrarPedidoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(cerrarPedidoSuccess),
        tap(action => {
          // console.log('Pedido persistido: ', action.pedido);
          // this.router.navigate(['/shop/cart', action.pedido.id]);
          this.router.navigate(['/pedidos']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<CartPartialState>,
    private pedidoService: PedidoService,
    private router: Router
  ) {}
}
