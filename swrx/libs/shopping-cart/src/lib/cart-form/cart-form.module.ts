import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';
import { CartMainFormComponent } from './cart-main-form/cart-main-form.component';
import { ClientesModule } from '@swrx/clientes';
import { CartTipoComponent } from './cart-tipo/cart-tipo.component';
import { CartUsoComponent } from './cart-uso/cart-uso.component';
import { CartFpagoComponent } from './cart-fpago/cart-fpago.component';
import { CartDescuentosComponent } from './cart-descuentos/cart-descuentos.component';
import { MatTableModule } from '@angular/material';

@NgModule({
  declarations: [
    CartMainFormComponent,
    CartTipoComponent,
    CartUsoComponent,
    CartFpagoComponent,
    CartDescuentosComponent
  ],
  entryComponents: [CartDescuentosComponent],
  imports: [UiCoreModule, ClientesModule, MatTableModule],
  exports: [
    CartMainFormComponent,
    CartTipoComponent,
    CartFpagoComponent,
    CartUsoComponent,
    CartDescuentosComponent
  ]
})
export class CartFormModule {}
