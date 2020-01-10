import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CLIENTES_FEATURE_KEY,
  ClientesState,
  ClientesPartialState,
  clientesAdapter
} from './clientes.reducer';

// Lookup the 'Clientes' feature state managed by NgRx
export const getClientesState = createFeatureSelector<
  ClientesPartialState,
  ClientesState
>(CLIENTES_FEATURE_KEY);

const { selectAll, selectEntities } = clientesAdapter.getSelectors();

export const selectClientesLoaded = createSelector(
  getClientesState,
  (state: ClientesState) => state.loaded
);
export const selectClientesLoading = createSelector(
  getClientesState,
  state => state.loading
)

export const getClientesError = createSelector(
  getClientesState,
  (state: ClientesState) => state.error
);

export const getAllClientes = createSelector(
  getClientesState,
  (state: ClientesState) => selectAll(state)
);

export const getClientesEntities = createSelector(
  getClientesState,
  (state: ClientesState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getClientesState,
  (state: ClientesState) => state.selectedId
);

export const getSelected = createSelector(
  getClientesEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

