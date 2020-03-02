import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { TablerosComponent } from './tableros.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromFeature from './+state';
import * as fromLogs from './+state/logs/logs.reducer';
import { LogsEffects } from './+state/logs/logs.effects';
import { LogsFacade } from './+state/logs/logs.facade';

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
  imports: [
    UiCoreModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(fromLogs.LOGS_FEATURE_KEY, fromLogs.reducer),
    EffectsModule.forFeature([LogsEffects])
  ],
  providers: [LogsFacade, fromFeature.SERVICES]
})
export class TablerosModule {}
