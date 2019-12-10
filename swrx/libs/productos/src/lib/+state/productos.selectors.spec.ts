import { ProductosEntity } from './productos.models';
import {
  ProductosState,
  productosAdapter,
  initialState
} from './productos.reducer';
import * as ProductosSelectors from './productos.selectors';

describe('Productos Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getProductosId = it => it['id'];
  const createProductosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ProductosEntity);

  let state;

  beforeEach(() => {
    state = {
      productos: productosAdapter.addAll(
        [
          createProductosEntity('PRODUCT-AAA'),
          createProductosEntity('PRODUCT-BBB'),
          createProductosEntity('PRODUCT-CCC')
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

  describe('Productos Selectors', () => {
    it('getAllProductos() should return the list of Productos', () => {
      const results = ProductosSelectors.getAllProductos(state);
      const selId = getProductosId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ProductosSelectors.getSelected(state);
      const selId = getProductosId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getProductosLoaded() should return the current 'loaded' status", () => {
      const result = ProductosSelectors.getProductosLoaded(state);

      expect(result).toBe(true);
    });

    it("getProductosError() should return the current 'error' state", () => {
      const result = ProductosSelectors.getProductosError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
