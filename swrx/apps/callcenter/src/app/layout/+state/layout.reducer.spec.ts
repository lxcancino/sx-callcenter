import { LayoutEntity } from './layout.models';
import * as LayoutActions from './layout.actions';
import { LayoutState, initialState, reducer } from './layout.reducer';

describe('Layout Reducer', () => {
  const createLayoutEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as LayoutEntity);

  beforeEach(() => {});

  describe('valid Layout actions', () => {
    it('loadLayoutSuccess should return set the list of known Layout', () => {
      const layout = [
        createLayoutEntity('PRODUCT-AAA'),
        createLayoutEntity('PRODUCT-zzz')
      ];
      const action = LayoutActions.loadLayoutSuccess({ layout });

      const result: LayoutState = reducer(initialState, action);

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
