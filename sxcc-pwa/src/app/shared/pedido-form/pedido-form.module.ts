import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoFormBuilderService } from './pedido-form.builder.service';
import { PedidoFormComponent } from './pedido-form.component';
import { FormFieldsModule } from '../form-fields/form-fields.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormFieldsModule,
  ],
  declarations: [PedidoFormComponent],
  providers: [PedidoFormBuilderService],
  exports: [PedidoFormComponent],
})
export class PedidoFormComponentModule {}
