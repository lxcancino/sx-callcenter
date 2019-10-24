import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { NotificationsEntity } from './notifications.models';
import { NotificationsEffects } from './notifications.effects';
import { NotificationsFacade } from './notifications.facade';

import * as NotificationsSelectors from './notifications.selectors';
import * as NotificationsActions from './notifications.actions';
import {
  NOTIFICATIONS_FEATURE_KEY,
  NotificationsState,
  initialState,
  reducer
} from './notifications.reducer';

interface TestSchema {
  notifications: NotificationsState;
}

describe('NotificationsFacade', () => {
  let facade: NotificationsFacade;
  let store: Store<TestSchema>;
  const createNotificationsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as NotificationsEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(NOTIFICATIONS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([NotificationsEffects])
        ],
        providers: [NotificationsFacade]
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule
        ]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.get(Store);
      facade = TestBed.get(NotificationsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allNotifications$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allNotifications$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadNotificationsSuccess` to manually update list
     */
    it('allNotifications$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allNotifications$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          NotificationsActions.loadNotificationsSuccess({
            notifications: [
              createNotificationsEntity('AAA'),
              createNotificationsEntity('BBB')
            ]
          })
        );

        list = await readFirst(facade.allNotifications$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(2);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
