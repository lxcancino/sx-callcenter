import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';

import { environment } from '../environments/environment';

import { DataPersistence } from '@nrwl/angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthModule } from '@swrx/auth';
import { AppRoutingModule } from './app.routing';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppRoutingModule,
    // Firebase service
    AngularFireModule.initializeApp(environment.firebase, 'swrx-callcemter'),
    AngularFirestoreModule,
    // DepositosModule,
    // Authorization
    AuthModule.forRoot(environment.firebase)
  ],
  providers: [
    DataPersistence,
    { provide: 'apiUrl', useValue: environment.apiUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
