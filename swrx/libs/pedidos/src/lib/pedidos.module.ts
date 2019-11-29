import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';

import { PedidosPageComponent } from './pedidos-page/pedidos-page.component';
import { PedidosTableComponent } from './pedidos-page/pedidos-table/pedidos-table.component';

export const routes: Route[] = [{ path: '', component: PedidosPageComponent }];

@NgModule({
  declarations: [PedidosPageComponent, PedidosTableComponent],
  imports: [UiCoreModule, RouterModule.forChild(routes)]
})
export class PedidosModule {}
