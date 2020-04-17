import { NgModule } from '@angular/core';

import { COMPONENTS, MODALS } from './components';
import { UiCoreModule } from '@swrx/ui-core';

@NgModule({
  imports: [UiCoreModule],
  declarations: [...COMPONENTS],
  entryComponents: [...MODALS]
})
export class CfdiModule {}
