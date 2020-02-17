import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PRODUCTOS_FEATURE_KEY,
  ProductosState,
  ProductosPartialState,
  productosAdapter
} from './productos.reducer';

// Lookup the 'Productos' feature state managed by NgRx
export const getProductosState = createFeatureSelector<
  ProductosPartialState,
  ProductosState
>(PRODUCTOS_FEATURE_KEY);

const { selectAll, selectEntities } = productosAdapter.getSelectors();

export const getProductosLoaded = createSelector(
  getProductosState,
  (state: ProductosState) => state.loaded
);

export const getProductosError = createSelector(
  getProductosState,
  (state: ProductosState) => state.error
);

export const getAllProductos = createSelector(
  getProductosState,
  (state: ProductosState) => selectAll(state)
);

export const getProductosEntities = createSelector(
  getProductosState,
  (state: ProductosState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getProductosState,
  (state: ProductosState) => state.selectedId
);

export const getSelected = createSelector(
  getProductosEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
