import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { TablerosComponent } from './tableros.component';

const routes: Route[] = [
  {
    path: 'all',
    component: TablerosComponent,
    children: [
      {
        path: '',
        redirectTo: 'pedidos'
      },
      {
        path: 'pedidos',
        loadChildren: () =>
          import('./pedidos-dashboard/pedidos-dashboard.module').then(
            m => m.PedidosDashboardModule
          )
      },
      {
        path: 'depositos',
        loadChildren: () =>
          import('./depositos-dashboard/depositos-dashboard.module').then(
            m => m.DepositosDashboardModule
          )
      }
    ]
  }
];

@NgModule({
  declarations: [TablerosComponent],
  imports: [UiCoreModule, RouterModule.forChild(routes)]
})
export class TablerosModule {}
