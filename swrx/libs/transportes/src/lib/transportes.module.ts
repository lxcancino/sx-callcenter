import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { FormUtilsModule } from '@swrx/form-utils';

import { TransportesComponent } from './transportes/transportes.component';
import { TransportesTableComponent } from './transportes-table/transportes-table.component';
import { TransporteFormComponent } from './transporte-form/transporte-form.component';
import { MaskPipe } from 'ngx-mask';

export const routes: Route[] = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      { path: 'all', component: TransportesComponent }
    ]
  }
];

@NgModule({
  imports: [UiCoreModule, FormUtilsModule, RouterModule.forChild(routes)],
  declarations: [
    TransportesComponent,
    TransportesTableComponent,
    TransporteFormComponent
  ],
  entryComponents: [TransporteFormComponent],
  providers: [MaskPipe]
})
export class TransportesModule {}
