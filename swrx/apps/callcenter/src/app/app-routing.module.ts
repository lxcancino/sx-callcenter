import { NgModule } from '@angular/core';
import { RouterModule, Route, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';

import {
  canActivate,
  redirectUnauthorizedTo,
  AngularFireAuthGuardModule
} from '@angular/fire/auth-guard';

import { MainPageComponent } from './main-page/main-page.component';
import { MainPageModule } from './main-page/main-page.module';

import { AuthModule, ProfileComponent } from '@swrx/auth';

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
        path: 'shop',
        loadChildren: () =>
          import('@swrx/shopping-cart').then(m => m.ShoppingCartModule)
      },
      {
        path: 'pedidos',
        loadChildren: () => import('@swrx/pedidos').then(m => m.PedidosModule)
      },
      {
        path: 'clientes',
        loadChildren: () => import('@swrx/clientes').then(m => m.ClientesModule)
      },
      {
        path: 'depositos',
        loadChildren: () =>
          import('@swrx/depositos').then(m => m.DepositosModule)
      },
      {
        path: 'transportes',
        loadChildren: () =>
          import('@swrx/transportes').then(m => m.TransportesModule)
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      // {
      //   path: 'existencias',
      //   loadChildren: () =>
      //     import('@swrx/existencias').then(m => m.ExistenciasModule)
      // }
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
    AngularFireAuthGuardModule,
    AuthModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
