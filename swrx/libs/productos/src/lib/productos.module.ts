import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { SelectorProductoComponent } from './selector-producto/selector-producto.component';
import { ProductoFieldComponent } from './producto-field/producto-field.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromProductos from './+state/productos.reducer';
import { ProductosEffects } from './+state/productos.effects';
import { ProductosFacade } from './+state/productos.facade';

@NgModule({
  imports: [
    UiCoreModule,
    StoreModule.forFeature(
      fromProductos.PRODUCTOS_FEATURE_KEY,
      fromProductos.reducer
    ),
    EffectsModule.forFeature([ProductosEffects])
  ],
  declarations: [SelectorProductoComponent, ProductoFieldComponent],
  entryComponents: [SelectorProductoComponent],
  exports: [SelectorProductoComponent, ProductoFieldComponent],
  providers: [ProductosFacade]
})
export class ProductosModule {}
