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

              const r1 = LogsActions.loadLogsSuccess({ logs: addedLogs });
              const r2 = LogsActions.loadLogsSuccess({ logs: modifiedLogs });
              return { added: addedLogs, modified: modifiedLogs };
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
          return res;
        })
      );
    },
    { dispatch: true }
  );
  /*
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LogsActions.loadLogs),
      switchMap(() =>
        this.service.fetchLogs().pipe(
          map(logs => LogsActions.loadLogsSuccess({ logs })),
          catchError(error => of(LogsActions.loadLogsFailure({ error })))
        )
      )
    );
  });
  */
  /*
  loadLogs$ = createEffect(() =>
    this.dataPersistence.fetch(LogsActions.loadLogs, {
      run: (
        action: ReturnType<typeof LogsActions.loadLogs>,
        state: LogsPartialState
      ) => {
        return this.service.fetchLogs().pipe(
          map(data => {
            const loaded = state[LOGS_FEATURE_KEY].loaded;
            console.log('State: ', state[LOGS_FEATURE_KEY]);
            if (!loaded) {
              console.log('Load all pedidos');
              return LogsActions.loadLogsSuccess({ logs: data });
            } else {
              console.log('Only update pedidos...');
              return LogsActions.updateLogs({ logs: data });
            }
          })
        );
      },

      onError: (action: ReturnType<typeof LogsActions.loadLogs>, error) => {
        console.error('Error', error);
        return LogsActions.loadLogsFailure({ error });
      }
    })
  );
    */
  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<LogsPartialState>,
    private service: LogService
  ) {}

  ngrxOnInitEffects(): Action {
    return LogsActions.loadLogs();
  }
}
