import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvioModule } from './envio/envio.module';

import { PedidoFormComponent } from './pedido-form.component';
import { FormFieldsModule } from '../form-fields/form-fields.module';
import { PedidoItemsListComponent } from './pedido-items-list/pedido-items.component';
import { PedidoItemComponent } from './pedido-item/pedido-item.component';
import { PedidoSumaryComponent } from './pedido-summary/pedido-summary.component';
import { PedidoValidationComponent } from './validation/pedido-validation.component';
import { CorteItemsListComponent } from './corte-items/corte-items-list.component';
import { PedidoClienteComponent } from './pedido-cliente/pedido-cliente.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormFieldsModule,
    EnvioModule,
  ],
  declarations: [
    PedidoFormComponent,
    PedidoClienteComponent,
    PedidoItemsListComponent,
    PedidoItemComponent,
    PedidoSumaryComponent,
    PedidoValidationComponent,
    CorteItemsListComponent,
  ],
  providers: [],
  exports: [PedidoFormComponent],
})
export class PedidoFormComponentModule {}
