import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';

import { DepositosPageComponent } from './depositos-page/depositos-page.component';
import { AddDepositoComponent } from './add-deposito/add-deposito.component';

const routes: Route[] = [{ path: '', component: DepositosPageComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UiCoreModule],
  declarations: [DepositosPageComponent, AddDepositoComponent]
})
export class DepositosModule {}
