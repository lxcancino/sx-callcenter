import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosPage } from './productos.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage,
    children: [
      {
        path: 'browser',
        loadChildren: () =>
          import('./prods-browser/prods-browser.module').then(
            (m) => m.ProdsBrowserPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/productos/browser',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/productos/browser',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosPageRoutingModule {}
