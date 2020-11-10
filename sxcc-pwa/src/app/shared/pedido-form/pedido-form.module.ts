import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoFormBuilderService } from './pedido-form.builder.service';
import { PedidoFormComponent } from './pedido-form.component';
import { FormFieldsModule } from '../form-fields/form-fields.module';
import { PedidoItemsListComponent } from './pedido-items-list/pedido-items.component';
import { PedidoItemComponent } from './pedido-item/pedido-item.component';
import { PedidoSumaryComponent } from './pedido-summary/pedido-summary.component';
import { PedidoValidationComponent } from './validation/pedido-validation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormFieldsModule,
  ],
  declarations: [
    PedidoFormComponent,
    PedidoItemsListComponent,
    PedidoItemComponent,
    PedidoSumaryComponent,
    PedidoValidationComponent,
  ],
  providers: [PedidoFormBuilderService],
  exports: [PedidoFormComponent],
})
export class PedidoFormComponentModule {}
