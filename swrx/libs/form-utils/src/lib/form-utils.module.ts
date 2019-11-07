import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { FechaFieldComponent } from './fecha-field/fecha-field.component';
import { NumericFieldComponent } from './numeric-field/numeric-field.component';
import { FocusManagerDirective } from './focus-manager/focus-manager.directive';

@NgModule({
  imports: [UiCoreModule],
  declarations: [
    FechaFieldComponent,
    NumericFieldComponent,
    FocusManagerDirective
  ],
  exports: [FechaFieldComponent, NumericFieldComponent, FocusManagerDirective]
})
export class FormUtilsModule {}
