import { ExistenciasEntity } from './existencias.models';
import {
  ExistenciasState,
  existenciasAdapter,
  initialState
} from './existencias.reducer';
import * as ExistenciasSelectors from './existencias.selectors';

describe('Existencias Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getExistenciasId = it => it['id'];
  const createExistenciasEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ExistenciasEntity);

  let state;

  beforeEach(() => {
    state = {
      existencias: existenciasAdapter.addAll(
        [
          createExistenciasEntity('PRODUCT-AAA'),
          createExistenciasEntity('PRODUCT-BBB'),
          createExistenciasEntity('PRODUCT-CCC')
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

  describe('Existencias Selectors', () => {
    it('getAllExistencias() should return the list of Existencias', () => {
      const results = ExistenciasSelectors.getAllExistencias(state);
      const selId = getExistenciasId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ExistenciasSelectors.getSelected(state);
      const selId = getExistenciasId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getExistenciasLoaded() should return the current 'loaded' status", () => {
      const result = ExistenciasSelectors.getExistenciasLoaded(state);

      expect(result).toBe(true);
    });

    it("getExistenciasError() should return the current 'error' state", () => {
      const result = ExistenciasSelectors.getExistenciasError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
