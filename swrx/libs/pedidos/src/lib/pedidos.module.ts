import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';

import { PedidosPageComponent } from './pedidos-page/pedidos-page.component';
import { PedidosTableComponent } from './pedidos-page/pedidos-table/pedidos-table.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromPedidos from './+state/pedidos.reducer';
import { PedidosEffects } from './+state/pedidos.effects';
import { PedidosFacade } from './+state/pedidos.facade';
import { AltPedidoComponent } from './alt-pedido/alt-pedido.component';
import { AutorizacionesPageComponent } from './autorizaciones-page/autorizaciones-page.component';

import { CfdiModule } from '@swrx/cfdi';
import { CerradosComponent } from './pedidos-page/cerrados/cerrados.component';

export const routes: Route[] = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: PedidosPageComponent }
    ]
  }
];

@NgModule({
  declarations: [
    PedidosPageComponent,
    PedidosTableComponent,
    AltPedidoComponent,
    AutorizacionesPageComponent,
    CerradosComponent
  ],
  entryComponents: [AltPedidoComponent],
  imports: [
    UiCoreModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(
      fromPedidos.PEDIDOS_FEATURE_KEY,
      fromPedidos.reducer
    ),
    EffectsModule.forFeature([PedidosEffects]),
    CfdiModule
  ],
  providers: [PedidosFacade]
})
export class PedidosModule {
  /*
  static forRoot(): ModuleWithProviders {
    return { ngModule: PedidosStateModule, providers: [] };
  }
  */
}
/*
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
export class PedidosStateModule {}
*/
