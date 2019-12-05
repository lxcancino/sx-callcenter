import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { PedidosPartialState } from './pedidos.reducer';
import * as PedidosActions from './pedidos.actions';

@Injectable()
export class PedidosEffects {
  loadPedidos$ = createEffect(() =>
    this.dataPersistence.fetch(PedidosActions.loadPedidos, {
      run: (
        action: ReturnType<typeof PedidosActions.loadPedidos>,
        state: PedidosPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return PedidosActions.loadPedidosSuccess({ pedidos: [] });
      },

      onError: (
        action: ReturnType<typeof PedidosActions.loadPedidos>,
        error
      ) => {
        console.error('Error', error);
        return PedidosActions.loadPedidosFailure({ error });
      }
    })
  );

  createPedido$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(PedidosActions.createPedido, {
      run: (
        action: ReturnType<typeof PedidosActions.createPedido>,
        state: PedidosPartialState
      ) => {
        return PedidosActions.createPedidoSuccess({ pedido: action.pedido });
      },

      onError: (
        action: ReturnType<typeof PedidosActions.createPedido>,
        error
      ) => {
        console.error('Error', error);
        return PedidosActions.createPedidoFail({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<PedidosPartialState>
  ) {}
}
