import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as NotificationsActions from './notifications.actions';
import { Notification } from './notifications.models';

export const NOTIFICATIONS_FEATURE_KEY = 'notifications';

export interface NotificationsState extends EntityState<Notification> {
  selectedId?: string; // which Notifications record has been selected
  loaded: boolean; // has the Notifications list been loaded
  error?: string | null; // last none error (if any)
}

export interface NotificationsPartialState {
  readonly [NOTIFICATIONS_FEATURE_KEY]: NotificationsState;
}

export const notificationsAdapter: EntityAdapter<
  Notification
> = createEntityAdapter<Notification>();

export const initialState: NotificationsState = notificationsAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false
  }
);

const notificationsReducer = createReducer(
  initialState,
  on(NotificationsActions.loadNotifications, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(
    NotificationsActions.loadNotificationsSuccess,
    (state, { notifications }) =>
      notificationsAdapter.addAll(notifications, { ...state, loaded: true })
  ),
  on(NotificationsActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(state: NotificationsState | undefined, action: Action) {
  return notificationsReducer(state, action);
}
