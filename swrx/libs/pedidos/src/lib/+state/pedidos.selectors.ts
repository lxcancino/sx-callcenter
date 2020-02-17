import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PEDIDOS_FEATURE_KEY,
  PedidosState,
  PedidosPartialState,
  pedidosAdapter
} from './pedidos.reducer';

// Lookup the 'Pedidos' feature state managed by NgRx
export const getPedidosState = createFeatureSelector<
  PedidosPartialState,
  PedidosState
>(PEDIDOS_FEATURE_KEY);

const { selectAll, selectEntities } = pedidosAdapter.getSelectors();

export const getPedidosLoaded = createSelector(
  getPedidosState,
  (state: PedidosState) => state.loaded
);
export const getPedidosLoading = createSelector(
  getPedidosState,
  (state: PedidosState) => state.loading
);

export const getPedidosError = createSelector(
  getPedidosState,
  (state: PedidosState) => state.error
);

export const getAllPedidos = createSelector(
  getPedidosState,
  (state: PedidosState) => selectAll(state)
);

export const getPedidosEntities = createSelector(
  getPedidosState,
  (state: PedidosState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getPedidosState,
  (state: PedidosState) => state.selectedId
);

export const getSelected = createSelector(
  getPedidosEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
