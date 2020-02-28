import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';
import { DepositosDashboardComponent } from './depositos-dashboard.component';

const routes: Route[] = [{ path: '', component: DepositosDashboardComponent }];

@NgModule({
  declarations: [DepositosDashboardComponent],
  imports: [UiCoreModule, RouterModule.forChild(routes)]
})
export class DepositosDashboardModule {}
