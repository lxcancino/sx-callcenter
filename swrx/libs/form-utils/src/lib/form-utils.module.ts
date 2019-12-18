import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { FechaFieldComponent } from './fecha-field/fecha-field.component';
import { NumericFieldComponent } from './numeric-field/numeric-field.component';
import { FocusManagerDirective } from './focus-manager/focus-manager.directive';
import { UpperCaseDirective } from './upper-case/upper-case.directive';
import { SucursalFieldComponent } from './sucursal-field/sucursal-field.component';
import { DireccionComponent } from './direccion/direccion.component';
import { DireccionFormComponent } from './direccion-form/direccion-form.component';

@NgModule({
  imports: [UiCoreModule],
  declarations: [
    FechaFieldComponent,
    NumericFieldComponent,
    FocusManagerDirective,
    UpperCaseDirective,
    SucursalFieldComponent,
    DireccionComponent,
    DireccionFormComponent
  ],
  entryComponents: [DireccionComponent],
  exports: [
    FechaFieldComponent,
    NumericFieldComponent,
    FocusManagerDirective,
    UpperCaseDirective,
    SucursalFieldComponent,
    DireccionComponent,
    DireccionFormComponent
  ]
})
export class FormUtilsModule {}
