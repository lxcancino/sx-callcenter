import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material';

import { UiCoreModule } from '@swrx/ui-core';
import { FormUtilsModule } from '@swrx/form-utils';

import { ClienteFieldComponent } from './cliente-field/cliente-field.component';
import { ClienteSelectorComponent } from './cliente-selector/cliente-selector.component';
import { ClientePageComponent } from './cliente-page/cliente-page.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromClientes from './+state/clientes.reducer';
import { ClientesEffects } from './+state/clientes.effects';
import { ClientesFacade } from './+state/clientes.facade';
import { ClienteCreateComponent } from './cliente-create/cliente-create.component';

const routes2: Route[] = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ClientePageComponent },
  { path: 'edit/:id', component: ClientePageComponent }
];

export const routes: Route[] = [
  {
    path: 'list',
    children: [
      // { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '', component: ClientePageComponent }
    ]
  }
];

@NgModule({
  imports: [
    UiCoreModule,
    FormUtilsModule,
    MatAutocompleteModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(
      fromClientes.CLIENTES_FEATURE_KEY,
      fromClientes.reducer
    ),
    EffectsModule.forFeature([ClientesEffects])
  ],
  declarations: [
    ClienteFieldComponent,
    ClienteSelectorComponent,
    ClientePageComponent,
    ClienteCreateComponent
  ],
  entryComponents: [ClienteSelectorComponent, ClienteCreateComponent],
  exports: [
    ClienteFieldComponent,
    ClienteSelectorComponent,
    ClientePageComponent
  ],
  providers: [ClientesFacade]
})
export class ClientesModule {}
