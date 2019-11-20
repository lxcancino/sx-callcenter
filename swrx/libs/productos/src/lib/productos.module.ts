import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { SelectorProductoComponent } from './selector-producto/selector-producto.component';

@NgModule({
  imports: [UiCoreModule],
  declarations: [SelectorProductoComponent],
  entryComponents: [SelectorProductoComponent],
  exports: [SelectorProductoComponent]
})
export class ProductosModule {}
