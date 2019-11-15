import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { AutorizadosPageComponent } from './autorizados-page/autorizados-page.component';
import { AutorizadosTableComponent } from './autorizados-table/autorizados-table.component';

@NgModule({
  declarations: [AutorizadosPageComponent, AutorizadosTableComponent],
  imports: [
    UiCoreModule,
    RouterModule.forChild([{ path: '', component: AutorizadosPageComponent }])
  ]
})
export class AutorizadosModule {}
