import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DEPOSITOS_FEATURE_KEY,
  DepositosState,
  DepositosPartialState,
  depositosAdapter
} from './depositos.reducer';

// Lookup the 'Depositos' feature state managed by NgRx
export const getDepositosState = createFeatureSelector<
  DepositosPartialState,
  DepositosState
>(DEPOSITOS_FEATURE_KEY);

const { selectAll, selectEntities } = depositosAdapter.getSelectors();

export const getDepositosLoaded = createSelector(
  getDepositosState,
  (state: DepositosState) => state.loaded
);

export const getDepositosError = createSelector(
  getDepositosState,
  (state: DepositosState) => state.error
);

export const getAllDepositos = createSelector(
  getDepositosState,
  (state: DepositosState) => selectAll(state)
);

export const getDepositosEntities = createSelector(
  getDepositosState,
  (state: DepositosState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getDepositosState,
  (state: DepositosState) => state.selectedId
);

export const getSelected = createSelector(
  getDepositosEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
