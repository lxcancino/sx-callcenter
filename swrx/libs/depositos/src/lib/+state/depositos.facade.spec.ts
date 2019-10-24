import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { DepositosEntity } from './depositos.models';
import { DepositosEffects } from './depositos.effects';
import { DepositosFacade } from './depositos.facade';

import * as DepositosSelectors from './depositos.selectors';
import * as DepositosActions from './depositos.actions';
import {
  DEPOSITOS_FEATURE_KEY,
  DepositosState,
  initialState,
  reducer
} from './depositos.reducer';

interface TestSchema {
  depositos: DepositosState;
}

describe('DepositosFacade', () => {
  let facade: DepositosFacade;
  let store: Store<TestSchema>;
  const createDepositosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as DepositosEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(DEPOSITOS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([DepositosEffects])
        ],
        providers: [DepositosFacade]
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
      facade = TestBed.get(DepositosFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allDepositos$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allDepositos$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadDepositosSuccess` to manually update list
     */
    it('allDepositos$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allDepositos$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          DepositosActions.loadDepositosSuccess({
            depositos: [
              createDepositosEntity('AAA'),
              createDepositosEntity('BBB')
            ]
          })
        );

        list = await readFirst(facade.allDepositos$);
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
