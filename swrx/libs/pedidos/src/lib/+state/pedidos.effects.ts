import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { PedidosPartialState } from './pedidos.reducer';
import * as PedidosActions from './pedidos.actions';
import { PedidoService } from '../services/pedido.service';
import { map } from 'rxjs/operators';
import { PedidosPageComponent } from '../pedidos-page/pedidos-page.component';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class PedidosEffects {
  loadPedidos$ = createEffect(() =>
    this.dataPersistence.navigation(PedidosPageComponent, {
      run: (a: ActivatedRouteSnapshot, state: PedidosPartialState) => {
        console.log('Cargando los pedidos....');
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
  updatePedido$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(PedidosActions.updatePedido, {
      run: (
        action: ReturnType<typeof PedidosActions.updatePedido>,
        state: PedidosPartialState
      ) => {
        console.log('Actualizamdo pedido: ', action.update);
        return this.service
          .update(action.update)
          .pipe(map(pedido => PedidosActions.updatePedidoSuccess({ pedido })));
      },

      onError: (
        action: ReturnType<typeof PedidosActions.updatePedido>,
        error
      ) => {
        console.error('Actualizando pedido Error: ', error);
        return PedidosActions.updatePedidoFail({ error });
      }
    })
  );

  cerrarPedido$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(PedidosActions.cerrarPedido, {
      run: (
        action: ReturnType<typeof PedidosActions.cerrarPedido>,
        state: PedidosPartialState
      ) => {
        return this.service
          .cerrar(action.pedido)
          .pipe(map(pedido => PedidosActions.cerrarPedidoSuccess({ pedido })));
      },

      onError: (
        action: ReturnType<typeof PedidosActions.cerrarPedido>,
        error
      ) => {
        console.error('Cerrando pedido Error: ', error);
        return PedidosActions.cerrarPedidoError({ error });
      }
    })
  );

  autorizarPedido$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(PedidosActions.autorizarPedido, {
      run: (
        action: ReturnType<typeof PedidosActions.autorizarPedido>,
        state: PedidosPartialState
      ) => {
        return this.service
          .autorizar(action.id, action.auth)
          .pipe(
            map(pedido => PedidosActions.autorizarPedidoSuccess({ pedido }))
          );
      },
      onError: (
        action: ReturnType<typeof PedidosActions.autorizarPedido>,
        error
      ) => {
        console.error('Errir al autorizar pedido: ', error);
        return PedidosActions.autorizarPedidoError({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<PedidosPartialState>,
    private service: PedidoService
  ) {}
}
