import { createAction, props } from '@ngrx/store';
import { ProductosEntity } from './productos.models';

export const loadProductos = createAction('[Productos] Load Productos');

export const loadProductosSuccess = createAction(
  '[Productos] Load Productos Success',
  props<{ productos: ProductosEntity[] }>()
);

export const loadProductosFailure = createAction(
  '[Productos] Load Productos Failure',
  props<{ error: any }>()
);
