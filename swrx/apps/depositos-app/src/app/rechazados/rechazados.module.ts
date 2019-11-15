import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { RechazadosPageComponent } from './rechazados-page/rechazados-page.component';
import { UiCoreModule } from '@swrx/ui-core';
import { RechazadosTableComponent } from './rechazados-table/rechazados-table.component';

@NgModule({
  declarations: [RechazadosPageComponent, RechazadosTableComponent],
  imports: [
    UiCoreModule,
    RouterModule.forChild([{ path: '', component: RechazadosPageComponent }])
  ]
})
export class RechazadosModule {}
