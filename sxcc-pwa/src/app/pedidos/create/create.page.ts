import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cliente, Pedido, PedidoDet, PedidoImportes, Producto } from '@models';
import { CatalogosService } from '@data-access/services/catalogos.service';
import { PedidosFacade } from '@data-access/+state/pedidos/pedidos.facade';

import { PedidoFormComponent } from '../../shared/pedido-form/pedido-form.component';
import { AddPartidaComponent } from './add-partida/add-partida.component';
import { ProductoService } from '@data-access/services/producto.service';
import { DummyItem } from '@data-access/+state/pedidos/dummy';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  vm$ = combineLatest([
    this.catalogos.sucursales$,
    this.productoService.productosMap$,
  ]).pipe(map(([sucursales, productosMap]) => ({ sucursales, productosMap })));

  title$ = new BehaviorSubject('Nuevo pedido');
  pedido$ = this.facade.newPedido$;
  sumary: PedidoImportes;

  @ViewChild('form') pedidoForm: PedidoFormComponent;

  constructor(
    private catalogos: CatalogosService,
    private productoService: ProductoService,
    private facade: PedidosFacade,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  showOptions() {}

  onClienteSelection(cliente: Cliente) {
    this.pedidoForm.setCliente(cliente);
  }

  onSave(pedido: Pedido) {
    this.facade.saveToCart(pedido);
  }

  addPartida() {
    this.pedidoForm.addPartida(DummyItem);
  }

  async addPartida2(dictionary?: { [key: string]: Producto }) {
    const params = this.pedidoForm.getEditItemParams();
    const modal = await this.modalCtrl.create({
      component: AddPartidaComponent,
      id: AddPartidaComponent.MODAL_ID,
      componentProps: {
        lookup: (clave: string) => (dictionary ? dictionary[clave] : null),
        pedidoDet: null,
        params,
      },
      swipeToClose: true,
      presentingElement: await this.modalCtrl.getTop(),
    });

    await modal.present();
    const result = await modal.onWillDismiss();
    const item: PedidoDet = result.data;
    console.log('Partida por agregar: ', item);
  }

  onSumaryChanged(sumary: PedidoImportes) {
    this.sumary = sumary;
  }
}
