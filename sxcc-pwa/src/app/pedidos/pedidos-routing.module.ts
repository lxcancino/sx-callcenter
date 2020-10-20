import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosPage } from './pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPage,
    children: [
      {
        path: 'cotizaciones',
        loadChildren: () =>
          import('./cotizaciones/cotizaciones.module').then(
            (m) => m.CotizacionesPageModule
          ),
      },
      {
        path: 'pendientes',
        loadChildren: () =>
          import('./pendientes/pendientes.module').then(
            (m) => m.PendientesPageModule
          ),
      },
      {
        path: 'facturados',
        loadChildren: () =>
          import('./facturados/facturados.module').then(
            (m) => m.FacturadosPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/pedidos/cotizaciones',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreatePageModule),
  },
  {
    path: '',
    redirectTo: '/pedidos/cotizaciones',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosPageRoutingModule {}
