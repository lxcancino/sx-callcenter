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

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromLayout from './+state/layout.reducer';
import { LayoutEffects } from './+state/layout.effects';
import { LayoutFacade } from './+state/layout.facade';

@NgModule({
  declarations: [MainToolbarComponent],
  imports: [
    RouterModule,
    UiCoreModule,
    NotificationsModule,
    StoreModule.forFeature(fromLayout.LAYOUT_FEATURE_KEY, fromLayout.reducer),
    EffectsModule.forFeature([LayoutEffects])
  ],
  exports: [MainToolbarComponent],
  providers: [LayoutFacade]
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
