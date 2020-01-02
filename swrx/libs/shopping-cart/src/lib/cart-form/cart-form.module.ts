import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';
import { CartMainFormComponent } from './cart-main-form/cart-main-form.component';
import { ClientesModule } from '@swrx/clientes';
import { CartTipoComponent } from './cart-tipo/cart-tipo.component';
import { CartUsoComponent } from './cart-uso/cart-uso.component';
import { CartFpagoComponent } from './cart-fpago/cart-fpago.component';


@NgModule({
  declarations: [
    CartMainFormComponent,
    CartTipoComponent,
    CartUsoComponent,
    CartFpagoComponent,
  ],
  imports: [UiCoreModule, ClientesModule],
  exports: [
    CartMainFormComponent,
    CartTipoComponent,
    CartFpagoComponent,
    CartUsoComponent
  ]
})
export class CartFormModule {}
