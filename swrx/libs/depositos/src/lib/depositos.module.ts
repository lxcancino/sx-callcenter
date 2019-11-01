import { NgModule } from '@angular/core';

import { Route, RouterModule } from '@angular/router';

import { MatSelectModule } from '@angular/material';

import { UiCoreModule } from '@swrx/ui-core';
import { ClientesModule } from '@swrx/clientes';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDepositos from './+state/depositos.reducer';
import { DepositosEffects } from './+state/depositos.effects';
import { DepositosFacade } from './+state/depositos.facade';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faBell,
  faPlus,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';

import { DepositosPageComponent } from './depositos-page/depositos-page.component';
import { DepositoCreateComponent } from './deposito-create/deposito-create.component';
import { DepositoCreateBtnComponent } from './deposito-create/deposito-create-btn.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BancoFieldComponent } from './banco-field/banco-field.component';
import { CuentasFieldComponent } from './cuentas-field/cuentas-field.component';

const routes: Route[] = [{ path: '', component: DepositosPageComponent }];

@NgModule({
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    UiCoreModule,
    MatSelectModule,
    ClientesModule,
    StoreModule.forFeature(
      fromDepositos.DEPOSITOS_FEATURE_KEY,
      fromDepositos.reducer
    ),
    EffectsModule.forFeature([DepositosEffects])
  ],
  declarations: [
    DepositosPageComponent,
    DepositoCreateComponent,
    DepositoCreateBtnComponent,
    BancoFieldComponent,
    CuentasFieldComponent
  ],
  entryComponents: [DepositoCreateComponent],
  providers: [DepositosFacade],
  exports: [BancoFieldComponent, CuentasFieldComponent]
})
export class DepositosModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBell, faPlus, faPlusCircle);
  }
}
