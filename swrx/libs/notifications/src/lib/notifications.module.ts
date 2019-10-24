import { NgModule } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { NotificationBtnComponent } from './notification-btn/notification-btn.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [UiCoreModule],
  declarations: [NotificationBtnComponent],
  exports: [NotificationBtnComponent]
})
export class NotificationsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBell);
  }
}
