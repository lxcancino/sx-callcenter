import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { UiCoreModule } from '@swrx/ui-core';
import { MatSidenavModule } from '@angular/material';
import { FooterComponent } from './footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faFileInvoiceDollar,
  faFileInvoice,
  faShoppingCart,
  faHandHoldingUsd,
  faCogs,
  faBell,
  faUsers,
  faLayerGroup,
  faHome,
  faClock,
  faCheckCircle,
  faCommentSlash,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [MainPageComponent, FooterComponent, ToolbarComponent],
  imports: [RouterModule, UiCoreModule, MatSidenavModule],
  exports: [MainPageComponent]
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
      faLayerGroup,
      faHome,
      faClock,
      faCheckCircle,
      faCommentSlash,
      faSignOutAlt
    );
  }
}
