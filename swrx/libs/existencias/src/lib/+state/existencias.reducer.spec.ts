import { ExistenciasEntity } from './existencias.models';
import * as ExistenciasActions from './existencias.actions';
import { ExistenciasState, initialState, reducer } from './existencias.reducer';

describe('Existencias Reducer', () => {
  const createExistenciasEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ExistenciasEntity);

  beforeEach(() => {});

  describe('valid Existencias actions', () => {
    it('loadExistenciasSuccess should return set the list of known Existencias', () => {
      const existencias = [
        createExistenciasEntity('PRODUCT-AAA'),
        createExistenciasEntity('PRODUCT-zzz')
      ];
      const action = ExistenciasActions.loadExistenciasSuccess({ existencias });

      const result: ExistenciasState = reducer(initialState, action);

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
