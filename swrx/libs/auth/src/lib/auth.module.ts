import { NgModule, ModuleWithProviders } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { FirebaseAppConfig } from '@angular/fire';
import {
  NgxAuthFirebaseUIModule,
  NgxAuthFirebaseUIConfig
} from 'ngx-auth-firebaseui';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    NgxAuthFirebaseUIModule,
    RouterModule.forRoot([
      {
        path: 'loginx',
        component: LoginComponent
      }
    ]),
    UiCoreModule
  ],
  declarations: [LoginComponent, ProfileComponent],
  exports: [NgxAuthFirebaseUIModule, ProfileComponent]
})
export class AuthModule {
  static forRoot(
    fbConfig: FirebaseAppConfig,
    appNameFactory?: () => string,
    config?: NgxAuthFirebaseUIConfig
  ): ModuleWithProviders {
    return NgxAuthFirebaseUIModule.forRoot(fbConfig, appNameFactory, config);
  }
}
