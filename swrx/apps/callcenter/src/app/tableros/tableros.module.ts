import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { TablerosComponent } from './tableros.component';

const routes: Route[] = [];

@NgModule({
  declarations: [TablerosComponent],
  imports: [UiCoreModule, RouterModule.forChild(routes)]
})
export class TablerosModule {}
