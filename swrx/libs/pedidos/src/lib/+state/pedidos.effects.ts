import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { PedidosPartialState } from './pedidos.reducer';
import * as PedidosActions from './pedidos.actions';
import { PedidoService } from '../services/pedido.service';
import { map } from 'rxjs/operators';
import { PedidosPageComponent } from '../pedidos-page/pedidos-page.component';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';

@Injectable()
export class PedidosEffects {
  loadPedidos$ = createEffect(() =>
    this.dataPersistence.navigation(PedidosPageComponent, {
      run: (a: ActivatedRouteSnapshot, state: PedidosPartialState) => {
        console.log('Cargando los pedidos....');

        // .pipe(map( pedidos => PedidosActions.loadPedidosSuccess({ pedidos }))
        // return PedidosActions.loadPedidosSuccess({ pedidos: [] });
        return this.service
          .list()
          .pipe(map(pedidos => PedidosActions.loadPedidosSuccess({ pedidos })));
      },
      onError: (a: ActivatedRouteSnapshot, e: any) => {
        // we can log and error here and return null
        // we can also navigate back
        console.error('Pedidos not loaded....');
        return null;
      }
    })
  );

  createPedido$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(PedidosActions.createPedido, {
      run: (
        action: ReturnType<typeof PedidosActions.createPedido>,
        state: PedidosPartialState
      ) => {
        return this.service
          .save(action.pedido)
          .pipe(map(pedido => PedidosActions.createPedidoSuccess({ pedido })));
      },

      onError: (
        action: ReturnType<typeof PedidosActions.createPedido>,
        error
      ) => {
        console.error('Error salvando pedido Error: ', error);
        return PedidosActions.createPedidoFail({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<PedidosPartialState>,
    private service: PedidoService
  ) {}
}
