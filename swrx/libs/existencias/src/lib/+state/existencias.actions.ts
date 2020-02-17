import { createAction, props } from '@ngrx/store';
import { ExistenciasEntity } from './existencias.models';

export const loadExistencias = createAction('[Existencias] Load Existencias');

export const loadExistenciasSuccess = createAction(
  '[Existencias] Load Existencias Success',
  props<{ existencias: ExistenciasEntity[] }>()
);

export const loadExistenciasFailure = createAction(
  '[Existencias] Load Existencias Failure',
  props<{ error: any }>()
);

export const upsertExistencia = createAction(
  '[Existencias Effect] Upsert',
  props<{ existencia: ExistenciasEntity }>()
);
