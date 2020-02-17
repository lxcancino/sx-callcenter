import { ProductosEntity } from './productos.models';
import * as ProductosActions from './productos.actions';
import { ProductosState, initialState, reducer } from './productos.reducer';

describe('Productos Reducer', () => {
  const createProductosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ProductosEntity);

  beforeEach(() => {});

  describe('valid Productos actions', () => {
    it('loadProductosSuccess should return set the list of known Productos', () => {
      const productos = [
        createProductosEntity('PRODUCT-AAA'),
        createProductosEntity('PRODUCT-zzz')
      ];
      const action = ProductosActions.loadProductosSuccess({ productos });

      const result: ProductosState = reducer(initialState, action);

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
