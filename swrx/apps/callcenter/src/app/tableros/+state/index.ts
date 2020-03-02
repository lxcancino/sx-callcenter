import { ActionReducerMap } from '@ngrx/store';

import * as fromLogs from './logs/logs.reducer';

export const TABLEROS_FEATURE_KEY = 'dashboards';

export interface State {
  logs: fromLogs.LogsState;
}

export const reducres: ActionReducerMap<State> = {
  logs: fromLogs.reducer
};

export * from './services';
