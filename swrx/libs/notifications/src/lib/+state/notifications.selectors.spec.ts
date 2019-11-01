import { Notification } from './notification.models';
import {
  NotificationsState,
  notificationsAdapter,
  initialState
} from './notifications.reducer';
import * as NotificationsSelectors from './notifications.selectors';

describe('Notifications Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getNotificationsId = it => it['id'];
  const createNotificationsEntity = (id: string, name = '') =>
    ({
      id,
      message: name || `name-${id}`
    } as Notification);

  let state;

  beforeEach(() => {
    state = {
      notifications: notificationsAdapter.addAll(
        [
          createNotificationsEntity('PRODUCT-AAA'),
          createNotificationsEntity('PRODUCT-BBB'),
          createNotificationsEntity('PRODUCT-CCC')
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true
        }
      )
    };
  });

  describe('Notifications Selectors', () => {
    it('getAllNotifications() should return the list of Notifications', () => {
      const results = NotificationsSelectors.getAllNotifications(state);
      const selId = getNotificationsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = NotificationsSelectors.getSelected(state);
      const selId = getNotificationsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getNotificationsLoaded() should return the current 'loaded' status", () => {
      const result = NotificationsSelectors.getNotificationsLoaded(state);

      expect(result).toBe(true);
    });

    it("getNotificationsError() should return the current 'error' state", () => {
      const result = NotificationsSelectors.getNotificationsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
