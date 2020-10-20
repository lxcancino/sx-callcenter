import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdsBrowserPageRoutingModule } from './prods-browser-routing.module';

import { ProdsBrowserPage } from './prods-browser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdsBrowserPageRoutingModule
  ],
  declarations: [ProdsBrowserPage]
})
export class ProdsBrowserPageModule {}
