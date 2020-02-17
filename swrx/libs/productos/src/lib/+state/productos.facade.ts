import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromProductos from './productos.reducer';
import * as ProductosSelectors from './productos.selectors';
import * as ProductosActions from './productos.actions';

@Injectable()
export class ProductosFacade {
  loaded$ = this.store.pipe(select(ProductosSelectors.getProductosLoaded));
  allProductos$ = this.store.pipe(select(ProductosSelectors.getAllProductos));
  selectedProductos$ = this.store.pipe(select(ProductosSelectors.getSelected));

  constructor(private store: Store<fromProductos.ProductosPartialState>) {}

  loadAll() {
    this.store.dispatch(ProductosActions.loadProductos());
  }
}
