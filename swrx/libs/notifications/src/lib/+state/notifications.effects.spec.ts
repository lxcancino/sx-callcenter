import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { NotificationsEffects } from './notifications.effects';
import * as NotificationsActions from './notifications.actions';

describe('NotificationsEffects', () => {
  let actions: Observable<any>;
  let effects: NotificationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        NotificationsEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(NotificationsEffects);
  });

  describe('loadNotifications$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: NotificationsActions.loadNotifications() });

      const expected = hot('-a-|', {
        a: NotificationsActions.loadNotificationsSuccess({ notifications: [] })
      });

      expect(effects.loadNotifications$).toBeObservable(expected);
    });
  });
});
