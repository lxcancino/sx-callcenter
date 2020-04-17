import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { COMPONENTS, DIALOGS } from './components';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [UiCoreModule, FormsModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [...DIALOGS]
})
export class ReportsModule {}
