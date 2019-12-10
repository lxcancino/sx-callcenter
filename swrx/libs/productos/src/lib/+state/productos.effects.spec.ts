import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { ProductosEffects } from './productos.effects';
import * as ProductosActions from './productos.actions';

describe('ProductosEffects', () => {
  let actions: Observable<any>;
  let effects: ProductosEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        ProductosEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(ProductosEffects);
  });

  describe('loadProductos$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ProductosActions.loadProductos() });

      const expected = hot('-a-|', {
        a: ProductosActions.loadProductosSuccess({ productos: [] })
      });

      expect(effects.loadProductos$).toBeObservable(expected);
    });
  });
});
