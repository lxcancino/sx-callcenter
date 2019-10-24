import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { DepositosEffects } from './depositos.effects';
import * as DepositosActions from './depositos.actions';

describe('DepositosEffects', () => {
  let actions: Observable<any>;
  let effects: DepositosEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        DepositosEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(DepositosEffects);
  });

  describe('loadDepositos$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: DepositosActions.loadDepositos() });

      const expected = hot('-a-|', {
        a: DepositosActions.loadDepositosSuccess({ depositos: [] })
      });

      expect(effects.loadDepositos$).toBeObservable(expected);
    });
  });
});
