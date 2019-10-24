import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as DepositosActions from './depositos.actions';
import { DepositosEntity } from './depositos.models';

export const DEPOSITOS_FEATURE_KEY = 'depositos';

export interface DepositosState extends EntityState<DepositosEntity> {
  selectedId?: string | number; // which Depositos record has been selected
  loaded: boolean; // has the Depositos list been loaded
  error?: string | null; // last none error (if any)
}

export interface DepositosPartialState {
  readonly [DEPOSITOS_FEATURE_KEY]: DepositosState;
}

export const depositosAdapter: EntityAdapter<
  DepositosEntity
> = createEntityAdapter<DepositosEntity>();

export const initialState: DepositosState = depositosAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const depositosReducer = createReducer(
  initialState,
  on(DepositosActions.loadDepositos, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(DepositosActions.loadDepositosSuccess, (state, { depositos }) =>
    depositosAdapter.addAll(depositos, { ...state, loaded: true })
  ),
  on(DepositosActions.loadDepositosFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(state: DepositosState | undefined, action: Action) {
  return depositosReducer(state, action);
}
