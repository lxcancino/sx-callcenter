import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { ProductosEntity } from './productos.models';
import { ProductosEffects } from './productos.effects';
import { ProductosFacade } from './productos.facade';

import * as ProductosSelectors from './productos.selectors';
import * as ProductosActions from './productos.actions';
import {
  PRODUCTOS_FEATURE_KEY,
  ProductosState,
  initialState,
  reducer
} from './productos.reducer';

interface TestSchema {
  productos: ProductosState;
}

describe('ProductosFacade', () => {
  let facade: ProductosFacade;
  let store: Store<TestSchema>;
  const createProductosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ProductosEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(PRODUCTOS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([ProductosEffects])
        ],
        providers: [ProductosFacade]
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
      facade = TestBed.get(ProductosFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allProductos$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allProductos$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadProductosSuccess` to manually update list
     */
    it('allProductos$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allProductos$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          ProductosActions.loadProductosSuccess({
            productos: [
              createProductosEntity('AAA'),
              createProductosEntity('BBB')
            ]
          })
        );

        list = await readFirst(facade.allProductos$);
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
