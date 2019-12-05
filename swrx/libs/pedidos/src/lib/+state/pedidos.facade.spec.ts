import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { PedidosEntity } from './pedidos.models';
import { PedidosEffects } from './pedidos.effects';
import { PedidosFacade } from './pedidos.facade';

import * as PedidosSelectors from './pedidos.selectors';
import * as PedidosActions from './pedidos.actions';
import {
  PEDIDOS_FEATURE_KEY,
  PedidosState,
  initialState,
  reducer
} from './pedidos.reducer';

interface TestSchema {
  pedidos: PedidosState;
}

describe('PedidosFacade', () => {
  let facade: PedidosFacade;
  let store: Store<TestSchema>;
  const createPedidosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as PedidosEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(PEDIDOS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([PedidosEffects])
        ],
        providers: [PedidosFacade]
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
      facade = TestBed.get(PedidosFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allPedidos$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allPedidos$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadPedidosSuccess` to manually update list
     */
    it('allPedidos$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allPedidos$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          PedidosActions.loadPedidosSuccess({
            pedidos: [createPedidosEntity('AAA'), createPedidosEntity('BBB')]
          })
        );

        list = await readFirst(facade.allPedidos$);
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
