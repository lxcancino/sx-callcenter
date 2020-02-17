import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { ExistenciasEffects } from './existencias.effects';
import * as ExistenciasActions from './existencias.actions';

describe('ExistenciasEffects', () => {
  let actions: Observable<any>;
  let effects: ExistenciasEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        ExistenciasEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(ExistenciasEffects);
  });

  describe('loadExistencias$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ExistenciasActions.loadExistencias() });

      const expected = hot('-a-|', {
        a: ExistenciasActions.loadExistenciasSuccess({ existencias: [] })
      });

      expect(effects.loadExistencias$).toBeObservable(expected);
    });
  });
});
