import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { CreatePage } from './create.page';
import { PedidoFormComponentModule } from 'src/app/shared/pedido-form/pedido-form.module';
import { ClientesSharedModule } from 'src/app/shared/clientes/clientes-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoFormComponentModule,
    ClientesSharedModule,
    CreatePageRoutingModule,
  ],
  declarations: [CreatePage],
})
export class CreatePageModule {}
