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

  createPedido(pedido: Pedido) {
    // this.store.dispatch(PedidosActions.createPedido({ pedido }));
    return PedidosActions.createPedido({ pedido });
  }
}
