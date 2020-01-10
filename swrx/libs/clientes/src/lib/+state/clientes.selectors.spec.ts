import { ClientesEntity } from './clientes.models';
import {
  ClientesState,
  clientesAdapter,
  initialState
} from './clientes.reducer';
import * as ClientesSelectors from './clientes.selectors';

describe('Clientes Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getClientesId = it => it['id'];
  const createClientesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ClientesEntity);

  let state;

  beforeEach(() => {
    state = {
      clientes: clientesAdapter.addAll(
        [
          createClientesEntity('PRODUCT-AAA'),
          createClientesEntity('PRODUCT-BBB'),
          createClientesEntity('PRODUCT-CCC')
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true
        }
      )
    };
  });

  describe('Clientes Selectors', () => {
    it('getAllClientes() should return the list of Clientes', () => {
      const results = ClientesSelectors.getAllClientes(state);
      const selId = getClientesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ClientesSelectors.getSelected(state);
      const selId = getClientesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getClientesLoaded() should return the current 'loaded' status", () => {
      const result = ClientesSelectors.getClientesLoaded(state);

      expect(result).toBe(true);
    });

    it("getClientesError() should return the current 'error' state", () => {
      const result = ClientesSelectors.getClientesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
