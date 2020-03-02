import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as LogsActions from './logs.actions';
import { PedidoLog } from '@swrx/core-model';

export const LOGS_FEATURE_KEY = 'logs';

export interface LogsState extends EntityState<PedidoLog> {
  selectedId?: string | number;
  loaded: boolean;
  error?: string | null;
}

export interface LogsPartialState {
  readonly [LOGS_FEATURE_KEY]: LogsState;
}

export const logsAdapter: EntityAdapter<PedidoLog> = createEntityAdapter<
  PedidoLog
>();

export const initialState: LogsState = logsAdapter.getInitialState({
  loaded: false
});

const logsReducer = createReducer(
  initialState,
  on(LogsActions.loadLogs, state => ({ ...state, loaded: false, error: null })),
  on(LogsActions.loadLogsSuccess, (state, { logs }) =>
    logsAdapter.addAll(logs, { ...state, loaded: true })
  ),
  on(LogsActions.loadLogsFailure, (state, { error }) => ({ ...state, error })),

  on(LogsActions.updateLogsSuccess, (state, { logs }) =>
    logsAdapter.upsertMany(logs, { ...state })
  ),
  on(LogsActions.deleteLogsSuccess, (state, { ids }) =>
    logsAdapter.removeMany(ids, { ...state })
  )
);

export function reducer(state: LogsState | undefined, action: Action) {
  return logsReducer(state, action);
}
