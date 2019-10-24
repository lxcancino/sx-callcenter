import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromNotifications from './notifications.reducer';
import * as NotificationsSelectors from './notifications.selectors';
import * as NotificationsActions from './notifications.actions';

@Injectable()
export class NotificationsFacade {
  loaded$ = this.store.pipe(
    select(NotificationsSelectors.getNotificationsLoaded)
  );
  allNotifications$ = this.store.pipe(
    select(NotificationsSelectors.getAllNotifications)
  );
  selectedNotifications$ = this.store.pipe(
    select(NotificationsSelectors.getSelected)
  );

  constructor(
    private store: Store<fromNotifications.NotificationsPartialState>
  ) {}

  loadAll() {
    this.store.dispatch(NotificationsActions.loadNotifications());
  }
}
