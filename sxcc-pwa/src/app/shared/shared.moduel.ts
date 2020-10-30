import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormFieldsModule } from './form-fields/form-fields.module';

import { ProductoSelectorComponent } from './productos-selector/producto-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormFieldsModule,
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, FormFieldsModule],
  declarations: [ProductoSelectorComponent],
  providers: [],
})
export class SharedModule {}
