import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { SharedModule } from 'src/app/shared/shared.moduel';
import { PedidoFormComponentModule } from 'src/app/shared/pedido-form/pedido-form.module';
import { ClientesSharedModule } from 'src/app/shared/clientes/clientes-shared.module';
// Componentes
import { CreatePage } from './create.page';
import { AddPartidaComponent } from './add-partida/add-partida.component';
import { InstruccionDeCorteComponent } from './add-partida/instruccion/instruccion.component';
import { PedidoItemExistenciaComponent } from './add-partida/existencia/pedido-item-existencia.component';
import { PedidoItemCorteComponent } from './add-partida/corte/pedido-item-corte.component';
import { PedidoItemDescripcionComponent } from './add-partida/descripcion/pedido-item-descripcion.component';
import { PedidoItemValidationComponent } from './add-partida/validation/pedido-item-validation.component';

import { PedidoItemService } from './add-partida/pedido-item.service';
import { CreateOptionsComponent } from './create-options.component';

@NgModule({
  imports: [
    IonicModule,
    SharedModule,
    PedidoFormComponentModule,
    ClientesSharedModule,
    CreatePageRoutingModule,
  ],
  declarations: [
    CreatePage,
    CreateOptionsComponent,
    AddPartidaComponent,
    InstruccionDeCorteComponent,
    PedidoItemExistenciaComponent,
    PedidoItemCorteComponent,
    PedidoItemDescripcionComponent,
    PedidoItemValidationComponent,
  ],
  providers: [PedidoItemService],
})
export class CreatePageModule {}
