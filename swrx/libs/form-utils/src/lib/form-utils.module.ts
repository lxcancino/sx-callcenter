import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { FechaFieldComponent } from './fecha-field/fecha-field.component';
import { NumericFieldComponent } from './numeric-field/numeric-field.component';
import { FocusManagerDirective } from './focus-manager/focus-manager.directive';
import { UpperCaseDirective } from './upper-case/upper-case.directive';

@NgModule({
  imports: [UiCoreModule],
  declarations: [
    FechaFieldComponent,
    NumericFieldComponent,
    FocusManagerDirective,
    UpperCaseDirective
  ],
  exports: [
    FechaFieldComponent,
    NumericFieldComponent,
    FocusManagerDirective,
    UpperCaseDirective
  ]
})
export class FormUtilsModule {}
