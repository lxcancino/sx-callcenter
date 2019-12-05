import { PedidosEntity } from './pedidos.models';
import * as PedidosActions from './pedidos.actions';
import { PedidosState, initialState, reducer } from './pedidos.reducer';

describe('Pedidos Reducer', () => {
  const createPedidosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as PedidosEntity);

  beforeEach(() => {});

  describe('valid Pedidos actions', () => {
    it('loadPedidosSuccess should return set the list of known Pedidos', () => {
      const pedidos = [
        createPedidosEntity('PRODUCT-AAA'),
        createPedidosEntity('PRODUCT-zzz')
      ];
      const action = PedidosActions.loadPedidosSuccess({ pedidos });

      const result: PedidosState = reducer(initialState, action);

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
