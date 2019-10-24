import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { NotificationsPartialState } from './notifications.reducer';
import * as NotificationsActions from './notifications.actions';

@Injectable()
export class NotificationsEffects {
  loadNotifications$ = createEffect(() =>
    this.dataPersistence.fetch(NotificationsActions.loadNotifications, {
      run: (
        action: ReturnType<typeof NotificationsActions.loadNotifications>,
        state: NotificationsPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return NotificationsActions.loadNotificationsSuccess({
          notifications: []
        });
      },

      onError: (
        action: ReturnType<typeof NotificationsActions.loadNotifications>,
        error
      ) => {
        console.error('Error', error);
        return NotificationsActions.loadNotificationsFailure({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<NotificationsPartialState>
  ) {}
}
