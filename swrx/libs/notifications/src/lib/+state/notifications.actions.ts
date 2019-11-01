import { createAction, props } from '@ngrx/store';
import { Notification } from './notification.models';

export const loadNotifications = createAction(
  '[Notifications] Load Notifications'
);

export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Notifications Success',
  props<{ notifications: Notification[] }>()
);

export const loadNotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: any }>()
);

export const addManyNotifications = createAction(
  '[Notifications Efect] Add Many notifications',
  props<{ notifications: Notification[] }>()
);

export const fetchNotifications = createAction(
  '[Notifications Effect] Fetch notifications from firebase',
  props<{ notifications: Notification[] }>()
);

export const upsertNotification = createAction(
  '[Notifications Effect] Upsert',
  props<{ notification: Notification }>()
);
export const removeNotification = createAction(
  '[Notifications Effect] Remove',
  props<{ id: string }>()
);
