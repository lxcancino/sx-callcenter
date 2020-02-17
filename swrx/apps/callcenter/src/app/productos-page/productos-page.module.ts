import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { ProductosPageComponent } from './productos-page.component';
import { ProductosTableComponent } from './productos-table/productos-table.component';

const routes: Route[] = [{ path: 'all', component: ProductosPageComponent }];

@NgModule({
  declarations: [ProductosPageComponent, ProductosTableComponent],
  imports: [UiCoreModule, RouterModule.forChild(routes)]
})
export class ProductosPageModule {}
