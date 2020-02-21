import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromProductos from './+state/productos.reducer';
import { ProductosEffects } from './+state/productos.effects';
import { ProductosFacade } from './+state/productos.facade';

import {
  SelectorProductoComponent,
  AltpTableComponent
} from './selector-producto';
import { ProductoFieldComponent } from './producto-field/producto-field.component';

@NgModule({
  imports: [
    UiCoreModule,
    StoreModule.forFeature(
      fromProductos.PRODUCTOS_FEATURE_KEY,
      fromProductos.reducer
    ),
    EffectsModule.forFeature([ProductosEffects])
  ],
  declarations: [
    SelectorProductoComponent,
    ProductoFieldComponent,
    AltpTableComponent
  ],
  entryComponents: [SelectorProductoComponent],
  exports: [SelectorProductoComponent, ProductoFieldComponent],
  providers: [ProductosFacade]
})
export class ProductosModule {}
