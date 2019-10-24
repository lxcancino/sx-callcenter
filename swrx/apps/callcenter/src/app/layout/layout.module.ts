import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faFileInvoiceDollar,
  faFileInvoice,
  faShoppingCart,
  faHandHoldingUsd,
  faCogs,
  faBell,
  faUsers,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { NotificationsModule } from '@swrx/notifications';

@NgModule({
  declarations: [MainToolbarComponent],
  imports: [RouterModule, UiCoreModule, NotificationsModule],
  exports: [MainToolbarComponent]
})
export class LayoutModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faFileInvoice,
      faFileInvoiceDollar,
      faShoppingCart,
      faHandHoldingUsd,
      faCogs,
      faBell,
      faUsers,
      faLayerGroup
    );
  }
}
