import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { ClientesEffects } from './clientes.effects';
import * as ClientesActions from './clientes.actions';

describe('ClientesEffects', () => {
  let actions: Observable<any>;
  let effects: ClientesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        ClientesEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(ClientesEffects);
  });

  describe('loadClientes$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ClientesActions.loadClientes() });

      const expected = hot('-a-|', {
        a: ClientesActions.loadClientesSuccess({ clientes: [] })
      });

      expect(effects.loadClientes$).toBeObservable(expected);
    });
  });
});
