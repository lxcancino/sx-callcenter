import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturadosPage } from './facturados.page';

const routes: Routes = [
  {
    path: '',
    component: FacturadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturadosPageRoutingModule {}
