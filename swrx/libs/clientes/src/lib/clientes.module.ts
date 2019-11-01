import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material';

import { UiCoreModule } from '@swrx/ui-core';
import { ClienteFieldComponent } from './cliente-field/cliente-field.component';

@NgModule({
  imports: [UiCoreModule, MatAutocompleteModule, HttpClientModule],
  declarations: [ClienteFieldComponent],
  exports: [ClienteFieldComponent]
})
export class ClientesModule {}
