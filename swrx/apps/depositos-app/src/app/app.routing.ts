import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { HomeComponent } from './home/home.component';

import {
  canActivate,
  redirectUnauthorizedTo,
  AngularFireAuthGuardModule
} from '@angular/fire/auth-guard';
import { AuthModule } from '@swrx/auth';
import { MainPageComponent } from './layout/main-page/main-page.component';

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
        path: 'pendientes',
        loadChildren: () =>
          import('./pendientes/pendientes.module').then(m => m.PendientesModule)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },

  // {
  //   path: 'rechazados',
  //   loadChildren: () =>
  //     import('./rechazados/rechazados.module').then(m => m.RechazadosModule)
  // },
  // {
  //   path: 'autorizados',
  //   loadChildren: () =>
  //     import('./autorizados/autorizados.module').then(m => m.AutorizadosModule)
  // },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AngularFireAuthGuardModule,
    AuthModule
  ],
  exports: [RouterModule],
  declarations: [HomeComponent],
  providers: []
})
export class AppRoutingModule {}
