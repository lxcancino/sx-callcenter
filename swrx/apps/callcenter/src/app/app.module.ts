import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationsModule } from '@swrx/notifications';
import { ProductosModule } from '@swrx/productos';
import { ExistenciasModule } from '@swrx/existencias';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { DataPersistence } from '@nrwl/angular';

// Firebase AngularFire
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AuthModule } from '@swrx/auth';

import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { AppStateModule } from './+state/app.state.module';

/** TODO Find This is only required for the CartFacade required in the main toolbar  find the way to fix this
 * probably using the global store
 */
// tslint:disable-next-line: nx-enforce-module-boundaries
import { ShoppingCartModule } from '@swrx/shopping-cart';

import { NgxMaskModule } from 'ngx-mask';

import { ReportsModule } from '@swrx/reports';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // Firebase configuration
    AngularFireModule.initializeApp(environment.firebase, 'swrx-callcenter'),
    AngularFirestoreModule,
    AngularFireStorageModule,

    AppRoutingModule,
    NotificationsModule,
    ProductosModule,
    AppStateModule,
    ShoppingCartModule,
    ExistenciasModule,
    ReportsModule,

    // Authorization
    AuthModule.forRoot(environment.firebase),
    NgxMaskModule.forRoot()
  ],
  providers: [
    DataPersistence,
    { provide: 'apiUrl', useValue: environment.apiUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
