import { createAction, props } from '@ngrx/store';
import { LayoutEntity } from './layout.models';

export const loadLayout = createAction('[Layout] Load Layout');

export const loadLayoutSuccess = createAction(
  '[Layout] Load Layout Success',
  props<{ layout: LayoutEntity[] }>()
);

export const loadLayoutFailure = createAction(
  '[Layout] Load Layout Failure',
  props<{ error: any }>()
);
