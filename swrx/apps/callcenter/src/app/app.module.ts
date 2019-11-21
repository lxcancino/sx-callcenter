import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Route } from '@angular/router';

import { NotificationsModule } from '@swrx/notifications';
import { ProductosModule } from '@swrx/productos';
import { LayoutModule } from './layout/layout.module';
import { AppComponent } from './app.component';

import {
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { DataPersistence } from '@nrwl/angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

const routes: Route[] = [
  {
    path: 'depositos',
    loadChildren: () => import('@swrx/depositos').then(m => m.DepositosModule)
  },
  {
    path: 'shopping-cart',
    loadChildren: () =>
      import('@swrx/shopping-cart').then(m => m.ShoppingCartModule)
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    NotificationsModule,
    ProductosModule,
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
    AngularFirestoreModule
  ],
  providers: [DataPersistence],
  bootstrap: [AppComponent]
})
export class AppModule {}
