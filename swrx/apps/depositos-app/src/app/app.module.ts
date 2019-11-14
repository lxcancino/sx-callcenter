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

const routes: Route[] = [
  {
    path: 'pendientes',
    loadChildren: () =>
      import('./pendientes/pendientes.module').then(m => m.PendientesModule)
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
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
    DepositosModule
  ],
  providers: [DataPersistence],
  bootstrap: [AppComponent]
})
export class AppModule {}
