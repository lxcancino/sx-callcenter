import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';

import { DepositosPageComponent } from './depositos-page/depositos-page.component';
import { AddDepositoComponent } from './add-deposito/add-deposito.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDepositos from './+state/depositos.reducer';
import { DepositosEffects } from './+state/depositos.effects';
import { DepositosFacade } from './+state/depositos.facade';

const routes: Route[] = [{ path: '', component: DepositosPageComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UiCoreModule,
    StoreModule.forFeature(
      fromDepositos.DEPOSITOS_FEATURE_KEY,
      fromDepositos.reducer
    ),
    EffectsModule.forFeature([DepositosEffects])
  ],
  declarations: [DepositosPageComponent, AddDepositoComponent],
  providers: [DepositosFacade]
})
export class DepositosModule {}
