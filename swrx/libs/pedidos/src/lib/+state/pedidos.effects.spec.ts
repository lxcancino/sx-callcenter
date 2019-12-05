import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { PedidosEffects } from './pedidos.effects';
import * as PedidosActions from './pedidos.actions';

describe('PedidosEffects', () => {
  let actions: Observable<any>;
  let effects: PedidosEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        PedidosEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(PedidosEffects);
  });

  describe('loadPedidos$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: PedidosActions.loadPedidos() });

      const expected = hot('-a-|', {
        a: PedidosActions.loadPedidosSuccess({ pedidos: [] })
      });

      expect(effects.loadPedidos$).toBeObservable(expected);
    });
  });
});
