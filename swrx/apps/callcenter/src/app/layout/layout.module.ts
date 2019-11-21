import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';

import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { NotificationsModule } from '@swrx/notifications';
import { ShoppingCartModule } from '@swrx/shopping-cart';

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
    ShoppingCartModule,
    NotificationsModule,
    StoreModule.forFeature(fromLayout.LAYOUT_FEATURE_KEY, fromLayout.reducer),
    EffectsModule.forFeature([LayoutEffects])
  ],
  exports: [MainToolbarComponent],
  providers: [LayoutFacade]
})
export class LayoutModule {
  constructor() {}
}
