import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ProductoService } from '@data-access/services/producto.service';
import { PedidoDet, PedidoItemParams, PedidoParams } from '@models';
import { AddPartidaComponent } from './add-partida.component';
import { DummyItem } from '@data-access/+state/pedidos/dummy';
import { PedidosFacade } from '@data-access/+state/pedidos/pedidos.facade';

@Injectable()
export class PedidoItemService {
  productos$ = this.service.productosMap$;
  constructor(
    private modalController: ModalController,
    private service: ProductoService
  ) {}

  async addPartida2(params: PedidoItemParams) {
    return { ...DummyItem, ...params };
  }

  async addPartida(params: PedidoItemParams) {
    const modal = await this.modalController.create({
      component: AddPartidaComponent,
      id: AddPartidaComponent.MODAL_ID,
      componentProps: {
        pedidoDet: null,
        params,
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });

    await modal.present();
    const result = await modal.onWillDismiss();
    const item: PedidoDet = result.data;
    console.log('Partida por agregar: ', item);
    return item;
  }
}
