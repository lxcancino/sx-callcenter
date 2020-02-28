import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { PedidosDashboardComponent } from './pedidos-dashboard.component';
import { GRIDS } from './grids';
const routes: Route[] = [{ path: '', component: PedidosDashboardComponent }];

@NgModule({
  declarations: [PedidosDashboardComponent, ...GRIDS],
  imports: [UiCoreModule, RouterModule.forChild(routes)]
})
export class PedidosDashboardModule {}
