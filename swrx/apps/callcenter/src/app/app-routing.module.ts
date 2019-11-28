import { NgModule } from '@angular/core';
import { RouterModule, Route, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';

import {
  AngularFireAuthGuard,
  canActivate,
  redirectUnauthorizedTo,
  AngularFireAuthGuardModule
} from '@angular/fire/auth-guard';

import { MainPageComponent } from './main-page/main-page.component';
import { MainPageModule } from './main-page/main-page.module';

const redirectToLogin = () => redirectUnauthorizedTo(['loginx']);

const routes: Route[] = [
  {
    path: '',
    component: MainPageComponent,
    ...canActivate(redirectToLogin()),
    children: [
      {
        path: 'inicio',
        component: HomeComponent
      },
      {
        path: 'depositos',
        loadChildren: () =>
          import('@swrx/depositos').then(m => m.DepositosModule)
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('@swrx/shopping-cart').then(m => m.ShoppingCartModule)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    MainPageModule,
    RouterModule.forRoot(routes, {
      // initialNavigation: 'enabled',
      preloadingStrategy: PreloadAllModules
    }),
    AngularFireAuthGuardModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
