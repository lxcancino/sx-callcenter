import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { ExistenciasEntity } from './existencias.models';
import { ExistenciasEffects } from './existencias.effects';
import { ExistenciasFacade } from './existencias.facade';

import * as ExistenciasSelectors from './existencias.selectors';
import * as ExistenciasActions from './existencias.actions';
import {
  EXISTENCIAS_FEATURE_KEY,
  ExistenciasState,
  initialState,
  reducer
} from './existencias.reducer';

interface TestSchema {
  existencias: ExistenciasState;
}

describe('ExistenciasFacade', () => {
  let facade: ExistenciasFacade;
  let store: Store<TestSchema>;
  const createExistenciasEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ExistenciasEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(EXISTENCIAS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([ExistenciasEffects])
        ],
        providers: [ExistenciasFacade]
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
      facade = TestBed.get(ExistenciasFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allExistencias$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allExistencias$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadExistenciasSuccess` to manually update list
     */
    it('allExistencias$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allExistencias$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          ExistenciasActions.loadExistenciasSuccess({
            existencias: [
              createExistenciasEntity('AAA'),
              createExistenciasEntity('BBB')
            ]
          })
        );

        list = await readFirst(facade.allExistencias$);
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
