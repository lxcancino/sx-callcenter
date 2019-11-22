import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { SelectorProductoComponent } from './selector-producto/selector-producto.component';
import { ProductoFieldComponent } from './producto-field/producto-field.component';

@NgModule({
  imports: [UiCoreModule],
  declarations: [SelectorProductoComponent, ProductoFieldComponent],
  entryComponents: [SelectorProductoComponent],
  exports: [SelectorProductoComponent, ProductoFieldComponent]
})
export class ProductosModule {}
