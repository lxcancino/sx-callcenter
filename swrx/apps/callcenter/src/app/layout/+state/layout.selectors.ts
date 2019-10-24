import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  LAYOUT_FEATURE_KEY,
  LayoutState,
  LayoutPartialState,
  layoutAdapter
} from './layout.reducer';

// Lookup the 'Layout' feature state managed by NgRx
export const getLayoutState = createFeatureSelector<
  LayoutPartialState,
  LayoutState
>(LAYOUT_FEATURE_KEY);

const { selectAll, selectEntities } = layoutAdapter.getSelectors();

export const getLayoutLoaded = createSelector(
  getLayoutState,
  (state: LayoutState) => state.loaded
);

export const getLayoutError = createSelector(
  getLayoutState,
  (state: LayoutState) => state.error
);

export const getAllLayout = createSelector(
  getLayoutState,
  (state: LayoutState) => selectAll(state)
);

export const getLayoutEntities = createSelector(
  getLayoutState,
  (state: LayoutState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getLayoutState,
  (state: LayoutState) => state.selectedId
);

export const getSelected = createSelector(
  getLayoutEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
