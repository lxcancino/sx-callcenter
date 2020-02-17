import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ExistenciasActions from './existencias.actions';
import { ExistenciasEntity } from './existencias.models';

export const EXISTENCIAS_FEATURE_KEY = 'existencias';

export interface ExistenciasState extends EntityState<ExistenciasEntity> {
  selectedId?: string | number; // which Existencias record has been selected
  loaded: boolean; // has the Existencias list been loaded
  error?: string | null; // last none error (if any)
}

export interface ExistenciasPartialState {
  readonly [EXISTENCIAS_FEATURE_KEY]: ExistenciasState;
}

export const existenciasAdapter: EntityAdapter<
  ExistenciasEntity
> = createEntityAdapter<ExistenciasEntity>();

export const initialState: ExistenciasState = existenciasAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false
  }
);

const existenciasReducer = createReducer(
  initialState,
  on(ExistenciasActions.loadExistencias, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ExistenciasActions.loadExistenciasSuccess, (state, { existencias }) =>
    existenciasAdapter.addAll(existencias, { ...state, loaded: true })
  ),
  on(ExistenciasActions.loadExistenciasFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ExistenciasActions.upsertExistencia, (state, { existencia }) =>
    existenciasAdapter.upsertOne(existencia, { ...state })
  )
);

export function reducer(state: ExistenciasState | undefined, action: Action) {
  return existenciasReducer(state, action);
}
