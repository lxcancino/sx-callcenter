import { PedidosEntity } from './pedidos.models';
import { PedidosState, pedidosAdapter, initialState } from './pedidos.reducer';
import * as PedidosSelectors from './pedidos.selectors';

describe('Pedidos Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getPedidosId = it => it['id'];
  const createPedidosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as PedidosEntity);

  let state;

  beforeEach(() => {
    state = {
      pedidos: pedidosAdapter.addAll(
        [
          createPedidosEntity('PRODUCT-AAA'),
          createPedidosEntity('PRODUCT-BBB'),
          createPedidosEntity('PRODUCT-CCC')
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

  describe('Pedidos Selectors', () => {
    it('getAllPedidos() should return the list of Pedidos', () => {
      const results = PedidosSelectors.getAllPedidos(state);
      const selId = getPedidosId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = PedidosSelectors.getSelected(state);
      const selId = getPedidosId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getPedidosLoaded() should return the current 'loaded' status", () => {
      const result = PedidosSelectors.getPedidosLoaded(state);

      expect(result).toBe(true);
    });

    it("getPedidosError() should return the current 'error' state", () => {
      const result = PedidosSelectors.getPedidosError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
