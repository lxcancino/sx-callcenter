import { createAction, props } from '@ngrx/store';
import { DepositosEntity } from './depositos.models';

export const loadDepositos = createAction('[Depositos] Load Depositos');

export const loadDepositosSuccess = createAction(
  '[Depositos] Load Depositos Success',
  props<{ depositos: DepositosEntity[] }>()
);

export const loadDepositosFailure = createAction(
  '[Depositos] Load Depositos Failure',
  props<{ error: any }>()
);
