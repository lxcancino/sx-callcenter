import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule, Route } from '@angular/router';

import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { DataPersistence } from '@nrwl/angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { DepositosModule } from '@swrx/depositos';
import { HomeComponent } from './home/home.component';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
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
    path: 'rechazados',
    loadChildren: () =>
      import('./rechazados/rechazados.module').then(m => m.RechazadosModule)
  },
  {
    path: 'autorizados',
    loadChildren: () =>
      import('./autorizados/autorizados.module').then(m => m.AutorizadosModule)
  }
];

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true
        }
      }
    ),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'swrx-callcemter'),
    AngularFirestoreModule,
    DepositosModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' })
  ],
  providers: [DataPersistence],
  bootstrap: [AppComponent]
})
export class AppModule {}
