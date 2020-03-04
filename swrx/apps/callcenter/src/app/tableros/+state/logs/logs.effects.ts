import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { createEffect, Actions, OnInitEffects, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { LogsPartialState, LOGS_FEATURE_KEY } from './logs.reducer';
import * as LogsActions from './logs.actions';
import { LogService, mapToPedidoLog } from '../services/log.service';

import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

@Injectable()
export class LogsEffects implements OnInitEffects {
  startListener$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LogsActions.loadLogs),
        switchMap(() =>
          this.service.getPedidosLogSateChanges().pipe(
            map(actions => {
              const added = actions.filter(item => item.type === 'added');
              const modified = actions.filter(item => item.type === 'modified');
              const removed = actions.filter(item => item.type === 'removed');

              const addedLogs = added.map(mapToPedidoLog);
              const modifiedLogs = modified.map(mapToPedidoLog);
              const removedLogs = removed.map(mapToPedidoLog);

              return {
                added: addedLogs,
                modified: modifiedLogs,
                removed: removedLogs
              };
            }),
            catchError(error => of(LogsActions.loadLogsFailure({ error })))
          )
        ),
        switchMap((data: any) => {
          // if(data.added) {}
          const res = [];
          if (data.added.length) {
            console.log('Pedidos added: ', data.added.length);
            res.push(LogsActions.loadLogsSuccess({ logs: data.added }));
          }
          if (data.modified.length) {
            console.log('Pedidos modified: ', data.modified.length);
            res.push(LogsActions.updateLogsSuccess({ logs: data.modified }));
          }
          if (data.removed.length) {
            const ids = data.removed.map(item => item.id);
            res.push(LogsActions.deleteLogsSuccess({ ids }));
          }
          return res;
        })
      );
    },
    { dispatch: true }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<LogsPartialState>,
    private service: LogService
  ) {}

  ngrxOnInitEffects(): Action {
    return LogsActions.loadLogs();
  }
}
