import { NgModule } from '@angular/core';

import { Route, RouterModule } from '@angular/router';

import { MatSelectModule } from '@angular/material';

import { UiCoreModule } from '@swrx/ui-core';
import { FormUtilsModule } from '@swrx/form-utils';
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
import { CuentaFieldComponent } from './cuenta-field/cuenta-field.component';
import { DepositoImportesFieldComponent } from './deposito-importes-field/deposito-importes-field.component';
import { DepositosListComponent } from './depositos-list/depositos-list.component';
import { DepositoItemComponent } from './depositos-list/deposito-item/deposito-item.component';
import { DepositoEditComponent } from './deposito-edit/deposito-edit.component';
import { DepositosTableComponent } from './depositos-table/depositos-table.component';

export const routes: Route[] = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      { path: 'all', component: DepositosPageComponent }
    ]
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    UiCoreModule,
    FormUtilsModule,
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
    CuentaFieldComponent,
    DepositoImportesFieldComponent,
    DepositosListComponent,
    DepositoItemComponent,
    DepositoEditComponent,
    DepositosTableComponent
  ],
  entryComponents: [DepositoCreateComponent, DepositoEditComponent],
  providers: [DepositosFacade],
  exports: [BancoFieldComponent, CuentaFieldComponent]
})
export class DepositosModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBell, faPlus, faPlusCircle);
  }
}
