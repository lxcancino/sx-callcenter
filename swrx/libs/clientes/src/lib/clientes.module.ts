import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material';

import { UiCoreModule } from '@swrx/ui-core';
import { ClienteFieldComponent } from './cliente-field/cliente-field.component';
import { ClienteSelectorComponent } from './cliente-selector/cliente-selector.component';

@NgModule({
  imports: [UiCoreModule, MatAutocompleteModule, HttpClientModule],
  declarations: [ClienteFieldComponent, ClienteSelectorComponent],
  entryComponents: [ClienteSelectorComponent],
  exports: [ClienteFieldComponent, ClienteSelectorComponent]
})
export class ClientesModule {}
