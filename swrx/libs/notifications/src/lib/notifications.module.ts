import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { UiCoreModule } from '@swrx/ui-core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromNotifications from './+state/notifications.reducer';
import { NotificationsEffects } from './+state/notifications.effects';
import { NotificationsFacade } from './+state/notifications.facade';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import { NotificationBtnComponent } from './notification-btn/notification-btn.component';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';

const routes: Route[] = [
  { path: 'notifications', component: NotificationsPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    UiCoreModule,
    StoreModule.forFeature(
      fromNotifications.NOTIFICATIONS_FEATURE_KEY,
      fromNotifications.reducer
    ),
    EffectsModule.forFeature([NotificationsEffects])
  ],
  declarations: [NotificationBtnComponent, NotificationsPageComponent],
  exports: [NotificationBtnComponent, NotificationsPageComponent],
  providers: [NotificationsFacade]
})
export class NotificationsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBell);
  }
}
