import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as LayoutActions from './layout.actions';
import { LayoutEntity } from './layout.models';

export const LAYOUT_FEATURE_KEY = 'layout';

export interface LayoutState extends EntityState<LayoutEntity> {
  selectedId?: string | number; // which Layout record has been selected
  loaded: boolean; // has the Layout list been loaded
  error?: string | null; // last none error (if any)
}

export interface LayoutPartialState {
  readonly [LAYOUT_FEATURE_KEY]: LayoutState;
}

export const layoutAdapter: EntityAdapter<LayoutEntity> = createEntityAdapter<
  LayoutEntity
>();

export const initialState: LayoutState = layoutAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const layoutReducer = createReducer(
  initialState,
  on(LayoutActions.loadLayout, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(LayoutActions.loadLayoutSuccess, (state, { layout }) =>
    layoutAdapter.addAll(layout, { ...state, loaded: true })
  ),
  on(LayoutActions.loadLayoutFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(state: LayoutState | undefined, action: Action) {
  return layoutReducer(state, action);
}
