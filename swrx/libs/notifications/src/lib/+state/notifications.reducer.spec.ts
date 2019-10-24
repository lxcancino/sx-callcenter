import { Notification } from './notifications.models';
import * as NotificationsActions from './notifications.actions';
import {
  NotificationsState,
  initialState,
  reducer
} from './notifications.reducer';

describe('Notifications Reducer', () => {
  const createNotification = (id: string, message = '') =>
    ({
      id,
      message: message || `name-${id}`
    } as Notification);

  beforeEach(() => {});

  describe('valid Notifications actions', () => {
    it('loadNotificationsSuccess should return set the list of known Notifications', () => {
      const notifications = [
        createNotification('PRODUCT-AAA'),
        createNotification('PRODUCT-zzz')
      ];
      const action = NotificationsActions.loadNotificationsSuccess({
        notifications
      });

      const result: NotificationsState = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
