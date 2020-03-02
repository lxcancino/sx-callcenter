import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  LOGS_FEATURE_KEY,
  LogsState,
  LogsPartialState,
  logsAdapter
} from './logs.reducer';

// Lookup the 'Logs' feature state managed by NgRx
export const getLogsState = createFeatureSelector<LogsPartialState, LogsState>(
  LOGS_FEATURE_KEY
);

const { selectAll, selectEntities } = logsAdapter.getSelectors();

export const getLogsLoaded = createSelector(
  getLogsState,
  (state: LogsState) => state.loaded
);

export const getLogsError = createSelector(
  getLogsState,
  (state: LogsState) => state.error
);

export const getAllLogs = createSelector(
  getLogsState,
  (state: LogsState) => selectAll(state)
);

export const getLogsEntities = createSelector(
  getLogsState,
  (state: LogsState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getLogsState,
  (state: LogsState) => state.selectedId
);

export const getSelected = createSelector(
  getLogsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
