import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EXISTENCIAS_FEATURE_KEY,
  ExistenciasState,
  ExistenciasPartialState,
  existenciasAdapter
} from './existencias.reducer';

// Lookup the 'Existencias' feature state managed by NgRx
export const getExistenciasState = createFeatureSelector<
  ExistenciasPartialState,
  ExistenciasState
>(EXISTENCIAS_FEATURE_KEY);

const { selectAll, selectEntities } = existenciasAdapter.getSelectors();

export const getExistenciasLoaded = createSelector(
  getExistenciasState,
  (state: ExistenciasState) => state.loaded
);

export const getExistenciasError = createSelector(
  getExistenciasState,
  (state: ExistenciasState) => state.error
);

export const getAllExistencias = createSelector(
  getExistenciasState,
  (state: ExistenciasState) => selectAll(state)
);

export const getExistenciasEntities = createSelector(
  getExistenciasState,
  (state: ExistenciasState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getExistenciasState,
  (state: ExistenciasState) => state.selectedId
);

export const getSelected = createSelector(
  getExistenciasEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
