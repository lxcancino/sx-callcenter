import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationsModule } from '@swrx/notifications';
import { ProductosModule } from '@swrx/productos';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { DataPersistence } from '@nrwl/angular';

// Firebase AngularFire
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AuthModule } from '@swrx/auth';

import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { AppStateModule } from './+state/app.state.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NotificationsModule,
    ProductosModule,
    AppStateModule,
    // Firebase configuration
    AngularFireModule.initializeApp(environment.firebase, 'swrx-callcenter'),
    AngularFirestoreModule,
    // Authorization
    AuthModule.forRoot(environment.firebase)
  ],
  providers: [DataPersistence],
  bootstrap: [AppComponent]
})
export class AppModule {}
