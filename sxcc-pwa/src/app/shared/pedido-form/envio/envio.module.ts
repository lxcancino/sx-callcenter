import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormFieldsModule } from '@shared/form-fields/form-fields.module';

import { EnvioComponent } from './envio.component';
import { EnvioTipoComponent } from './envio-tipo.component';
import { EnvioHorarioFieldComponent } from './envio-horario-field.component';
import { EnvioDireccionComponent } from './envio-direccion.component';
import { DireccionModule } from '@shared/direccion/direccion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormFieldsModule,
    DireccionModule,
  ],
  declarations: [
    EnvioComponent,
    EnvioTipoComponent,
    EnvioDireccionComponent,
    EnvioHorarioFieldComponent,
  ],
  providers: [],
  exports: [EnvioComponent],
})
export class EnvioModule {}
