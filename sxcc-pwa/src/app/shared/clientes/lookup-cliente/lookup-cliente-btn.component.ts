import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cliente } from 'src/app/models';
import { LookupClienteComponent } from './lookup-cliente.component';

@Component({
  selector: 'sxcc-lookup-cliente-btn',
  template: `
    <ion-button expand="block" fill="clear" (click)="lookup()">
      <ion-icon slot="icon-only" name="person"></ion-icon>
    </ion-button>
  `,
})
export class LookupClienteBtnComponent implements OnInit {
  @Output() selection = new EventEmitter<Partial<Cliente>>();
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async lookup() {
    const modal = await this.modalController.create({
      component: LookupClienteComponent,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.selection.emit(data);
  }
}
