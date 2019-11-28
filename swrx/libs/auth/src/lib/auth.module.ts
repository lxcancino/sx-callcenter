import { NgModule, ModuleWithProviders } from '@angular/core';

import { UiCoreModule } from '@swrx/ui-core';

import { FirebaseAppConfig } from '@angular/fire';
import {
  NgxAuthFirebaseUIModule,
  NgxAuthFirebaseUIConfig
} from 'ngx-auth-firebaseui';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';

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
  exports: [NgxAuthFirebaseUIModule],
  declarations: [LoginComponent]
})
export class AuthModule {
  // configFactory: FirebaseAppConfig, appNameFactory?: () => string, config?: NgxAuthFirebaseUIConfig
  static forRoot(
    fbConfig: FirebaseAppConfig,
    appNameFactory?: () => string,
    config?: NgxAuthFirebaseUIConfig
  ): ModuleWithProviders {
    return NgxAuthFirebaseUIModule.forRoot(fbConfig, appNameFactory, config);
  }
}
