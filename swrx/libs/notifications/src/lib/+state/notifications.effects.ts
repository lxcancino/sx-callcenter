import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { createEffect, Actions, OnInitEffects, ofType } from '@ngrx/effects';
import * as NotificationsActions from './notifications.actions';
import { getNotificationsLoaded, getSelected } from './notifications.selectors';
import { DataPersistence } from '@nrwl/angular';

import {
  switchMap,
  map,
  mergeMap,
  tap,
  withLatestFrom,
  concatMap,
  catchError
} from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

import {
  NotificationsPartialState,
  NotificationsState,
  NOTIFICATIONS_FEATURE_KEY
} from './notifications.reducer';

import { NotificationService } from '../services/notification.service';

import { DocumentChangeAction } from '@angular/fire/firestore';
import { Notification } from './notification.models';

const mapToNotification = (
  item: DocumentChangeAction<Notification>
): Notification => {
  const data = item.payload.doc.data();
  const id = item.payload.doc.id;
  return { id, ...data };
};

const mapToNotificationAction = (item: DocumentChangeAction<Notification>) => {
  const notification = mapToNotification(item);
  switch (item.type) {
    case 'modified':
    case 'added':
      return NotificationsActions.upsertNotification({ notification });
    case 'removed':
      return NotificationsActions.removeNotification({ id: notification.id });
    default:
      throw Error(`Firebase DocumentChangeAction ${item.type} not supported`);
  }
};

@Injectable()
export class NotificationsEffects implements OnInitEffects {
  fetch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.loadNotifications),
        switchMap(() => this.service.getAllNotificationsAsStateChantes()),
        mergeMap(actions => {
          if (actions.length > 1) {
            const addActions = actions.filter(item => item.type === 'added');
            const otherActions = actions.filter(item => item.type !== 'added');
            const notifications = addActions.map(mapToNotification);
            this.store.dispatch(
              NotificationsActions.loadNotificationsSuccess({ notifications })
            );
            return otherActions;
          }
          return actions;
        }),
        map(action => mapToNotificationAction(action)),
        catchError(error =>
          of(NotificationsActions.loadNotificationsFailure({ error }))
        )
      ),
    {}
  );

  fetchError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.loadNotificationsFailure),
        map(action => action.error),
        map(error => console.log('Error fetching data: ', error))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<NotificationsPartialState>,
    private service: NotificationService,
    private store: Store<NotificationsPartialState>
  ) {}

  ngrxOnInitEffects(): Action {
    console.log('Inicializando Notifications effect');
    // return { type: '[Notifications Effect]: Init' };
    return NotificationsActions.loadNotifications();
  }
}
