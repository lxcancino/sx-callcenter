import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormFieldsModule } from '@shared/form-fields/form-fields.module';

import { EnvioComponent } from './envio.component';
import { EnvioTipoComponent } from './envio-tipo.component';
import { EnvioDireccionesComponent } from './envio-direciones.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormFieldsModule,
  ],
  declarations: [EnvioComponent, EnvioTipoComponent, EnvioDireccionesComponent],
  providers: [],
  exports: [EnvioComponent],
})
export class EnvioModule {}
