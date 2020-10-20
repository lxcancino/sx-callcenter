import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacturadosPageRoutingModule } from './facturados-routing.module';

import { FacturadosPage } from './facturados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacturadosPageRoutingModule
  ],
  declarations: [FacturadosPage]
})
export class FacturadosPageModule {}
