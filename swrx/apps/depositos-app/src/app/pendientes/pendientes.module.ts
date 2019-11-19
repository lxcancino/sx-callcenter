import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { PendientesPageComponent } from './pendientes-page/pendientes-page.component';
import { PendienteItemComponent } from './pendiente-item/pendiente-item.component';
import { AutorizarItemComponent } from './autorizar-item/autorizar-item.component';
import { RechazarItemComponent } from './rechazar-item/rechazar-item.component';

@NgModule({
  declarations: [
    PendientesPageComponent,
    PendienteItemComponent,
    AutorizarItemComponent,
    RechazarItemComponent
  ],
  entryComponents: [AutorizarItemComponent, RechazarItemComponent],
  imports: [
    UiCoreModule,
    RouterModule.forChild([{ path: '', component: PendientesPageComponent }])
  ]
})
export class PendientesModule {}
