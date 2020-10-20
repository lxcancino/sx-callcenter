import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupClienteComponent } from './lookup-cliente/lookup-cliente.component';
import { RouterModule } from '@angular/router';
import { LookupClienteBtnComponent } from './lookup-cliente/lookup-cliente-btn.component';

@NgModule({
  declarations: [LookupClienteComponent, LookupClienteBtnComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [LookupClienteComponent, LookupClienteBtnComponent],
})
export class ClientesSharedModule {}
