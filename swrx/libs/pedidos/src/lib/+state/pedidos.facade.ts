import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromPedidos from './pedidos.reducer';
import * as PedidosSelectors from './pedidos.selectors';
import * as PedidosActions from './pedidos.actions';
import { Pedido } from '@swrx/core-model';

@Injectable()
export class PedidosFacade {
  loaded$ = this.store.pipe(select(PedidosSelectors.getPedidosLoaded));
  allPedidos$ = this.store.pipe(select(PedidosSelectors.getAllPedidos));
  selectedPedidos$ = this.store.pipe(select(PedidosSelectors.getSelected));

  constructor(private store: Store<fromPedidos.PedidosPartialState>) {}

  loadAll() {
    this.store.dispatch(PedidosActions.loadPedidos());
  }

  createOrUpdatePedido(data: { id: string; changes: Pedido }) {
    if (data.id) {
      return PedidosActions.updatePedido({
        update: { id: data.id, changes: data.changes }
      });
    } else {
      return PedidosActions.createPedido({ pedido: data.changes });
    }
  }

  cerrarPedido(pedido: Pedido) {
    return PedidosActions.cerrarPedido({ pedido });
  }
}
