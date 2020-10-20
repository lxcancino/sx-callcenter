import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FIELDS } from './index';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [...FIELDS],
  exports: [...FIELDS],
})
export class FormFieldsModule {}
