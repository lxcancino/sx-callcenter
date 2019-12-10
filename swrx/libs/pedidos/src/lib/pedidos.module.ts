import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';

import { PedidosPageComponent } from './pedidos-page/pedidos-page.component';
import { PedidosTableComponent } from './pedidos-page/pedidos-table/pedidos-table.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromPedidos from './+state/pedidos.reducer';
import { PedidosEffects } from './+state/pedidos.effects';
import { PedidosFacade } from './+state/pedidos.facade';

export const routes: Route[] = [
  { path: 'index', component: PedidosPageComponent }
];

@NgModule({
  declarations: [PedidosPageComponent, PedidosTableComponent],
  imports: [
    UiCoreModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(
      fromPedidos.PEDIDOS_FEATURE_KEY,
      fromPedidos.reducer
    ),
    EffectsModule.forFeature([PedidosEffects])
  ],
  providers: [PedidosFacade]
})
export class PedidosModule {}
