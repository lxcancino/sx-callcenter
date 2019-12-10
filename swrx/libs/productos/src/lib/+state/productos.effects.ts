import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { ProductosPartialState } from './productos.reducer';
import * as ProductosActions from './productos.actions';

@Injectable()
export class ProductosEffects {
  loadProductos$ = createEffect(() =>
    this.dataPersistence.fetch(ProductosActions.loadProductos, {
      run: (
        action: ReturnType<typeof ProductosActions.loadProductos>,
        state: ProductosPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return ProductosActions.loadProductosSuccess({ productos: [] });
      },

      onError: (
        action: ReturnType<typeof ProductosActions.loadProductos>,
        error
      ) => {
        console.error('Error', error);
        return ProductosActions.loadProductosFailure({ error });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<ProductosPartialState>
  ) {}
}
