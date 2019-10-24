import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { LayoutEffects } from './layout.effects';
import * as LayoutActions from './layout.actions';

describe('LayoutEffects', () => {
  let actions: Observable<any>;
  let effects: LayoutEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        LayoutEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(LayoutEffects);
  });

  describe('loadLayout$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: LayoutActions.loadLayout() });

      const expected = hot('-a-|', {
        a: LayoutActions.loadLayoutSuccess({ layout: [] })
      });

      expect(effects.loadLayout$).toBeObservable(expected);
    });
  });
});
