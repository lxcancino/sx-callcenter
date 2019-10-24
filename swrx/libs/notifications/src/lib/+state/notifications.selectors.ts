import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NOTIFICATIONS_FEATURE_KEY,
  NotificationsState,
  NotificationsPartialState,
  notificationsAdapter
} from './notifications.reducer';

// Lookup the 'Notifications' feature state managed by NgRx
export const getNotificationsState = createFeatureSelector<
  NotificationsPartialState,
  NotificationsState
>(NOTIFICATIONS_FEATURE_KEY);

const { selectAll, selectEntities } = notificationsAdapter.getSelectors();

export const getNotificationsLoaded = createSelector(
  getNotificationsState,
  (state: NotificationsState) => state.loaded
);

export const getNotificationsError = createSelector(
  getNotificationsState,
  (state: NotificationsState) => state.error
);

export const getAllNotifications = createSelector(
  getNotificationsState,
  (state: NotificationsState) => selectAll(state)
);

export const getNotificationsEntities = createSelector(
  getNotificationsState,
  (state: NotificationsState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getNotificationsState,
  (state: NotificationsState) => state.selectedId
);

export const getSelected = createSelector(
  getNotificationsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
