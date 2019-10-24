import { DepositosEntity } from './depositos.models';
import * as DepositosActions from './depositos.actions';
import { DepositosState, initialState, reducer } from './depositos.reducer';

describe('Depositos Reducer', () => {
  const createDepositosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as DepositosEntity);

  beforeEach(() => {});

  describe('valid Depositos actions', () => {
    it('loadDepositosSuccess should return set the list of known Depositos', () => {
      const depositos = [
        createDepositosEntity('PRODUCT-AAA'),
        createDepositosEntity('PRODUCT-zzz')
      ];
      const action = DepositosActions.loadDepositosSuccess({ depositos });

      const result: DepositosState = reducer(initialState, action);

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
