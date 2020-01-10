import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { ClientesEntity } from './clientes.models';
import { ClientesEffects } from './clientes.effects';
import { ClientesFacade } from './clientes.facade';

import * as ClientesSelectors from './clientes.selectors';
import * as ClientesActions from './clientes.actions';
import {
  CLIENTES_FEATURE_KEY,
  ClientesState,
  initialState,
  reducer
} from './clientes.reducer';

interface TestSchema {
  clientes: ClientesState;
}

describe('ClientesFacade', () => {
  let facade: ClientesFacade;
  let store: Store<TestSchema>;
  const createClientesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ClientesEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(CLIENTES_FEATURE_KEY, reducer),
          EffectsModule.forFeature([ClientesEffects])
        ],
        providers: [ClientesFacade]
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
      facade = TestBed.get(ClientesFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allClientes$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allClientes$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadClientesSuccess` to manually update list
     */
    it('allClientes$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allClientes$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          ClientesActions.loadClientesSuccess({
            clientes: [createClientesEntity('AAA'), createClientesEntity('BBB')]
          })
        );

        list = await readFirst(facade.allClientes$);
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
