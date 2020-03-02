import { createAction, props } from '@ngrx/store';
import { PedidoLog } from '@swrx/core-model';

export const loadLogs = createAction('[LogsEffect] Load PedidoLogs');

export const loadLogsSuccess = createAction(
  '[Logs API] Load PedidoLogs Success',
  props<{ logs: PedidoLog[] }>()
);

export const loadLogsFailure = createAction(
  '[Logs API] Load PedidoLogs Failure',
  props<{ error: any }>()
);

export const updateLogsSuccess = createAction(
  '[LogsEffect] Update PedidosLog Success',
  props<{ logs: PedidoLog[] }>()
);

export const deleteLogsSuccess = createAction(
  '[LogEffect] Delete PedidosLog Success',
  props<{ ids: string[] }>()
);
