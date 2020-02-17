import { ClientesEntity } from './clientes.models';
import * as ClientesActions from './clientes.actions';
import { ClientesState, initialState, reducer } from './clientes.reducer';

describe('Clientes Reducer', () => {
  const createClientesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ClientesEntity);

  beforeEach(() => {});

  describe('valid Clientes actions', () => {
    it('loadClientesSuccess should return set the list of known Clientes', () => {
      const clientes = [
        createClientesEntity('PRODUCT-AAA'),
        createClientesEntity('PRODUCT-zzz')
      ];
      const action = ClientesActions.loadClientesSuccess({ clientes });

      const result: ClientesState = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
