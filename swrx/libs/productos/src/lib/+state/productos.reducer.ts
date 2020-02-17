import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ProductosActions from './productos.actions';
import { ProductosEntity } from './productos.models';

export const PRODUCTOS_FEATURE_KEY = 'productos';

export interface ProductosState extends EntityState<ProductosEntity> {
  selectedId?: string | number; // which Productos record has been selected
  loaded: boolean; // has the Productos list been loaded
  error?: string | null; // last none error (if any)
}

export interface ProductosPartialState {
  readonly [PRODUCTOS_FEATURE_KEY]: ProductosState;
}

export const productosAdapter: EntityAdapter<
  ProductosEntity
> = createEntityAdapter<ProductosEntity>();

export const initialState: ProductosState = productosAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const productosReducer = createReducer(
  initialState,
  on(ProductosActions.loadProductos, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ProductosActions.loadProductosSuccess, (state, { productos }) =>
    productosAdapter.addAll(productos, { ...state, loaded: true })
  ),
  on(ProductosActions.loadProductosFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(state: ProductosState | undefined, action: Action) {
  return productosReducer(state, action);
}
