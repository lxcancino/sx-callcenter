import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Cliente,
  Pedido,
  PedidoDet,
  PedidoParams,
  PedidoSummary,
  Producto,
  TipoDePedido,
} from '@models';

import { PedidosFacade } from '@data-access/+state/pedidos/pedidos.facade';
import { ProductoService } from '@data-access/services/producto.service';
import { PedidoFormComponent } from '@shared/pedido-form/pedido-form.component';
import { PedidoItemService } from './add-partida/pedido-item.service';

import { buildDummyPedido } from '@data-access/data';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, AfterViewInit {
  productos$ = this.productoService.productosMap$;

  title$ = new BehaviorSubject('Nuevo pedido');

  summary: PedidoSummary;
  pedido = buildDummyPedido(); //
  // pedido = this.facade.createNewPedido();

  @ViewChild(PedidoFormComponent)
  pedidoForm: PedidoFormComponent;
  params: PedidoParams;
  errors: ValidationErrors | null = null;

  constructor(
    private productoService: ProductoService,
    private facade: PedidosFacade,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    public toastController: ToastController,
    private itemService: PedidoItemService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  onClienteSelection(cliente: Cliente) {
    this.pedidoForm.setCliente(cliente);
  }

  canSave() {
    return this.pedidoForm ? this.pedidoForm.canSave : false;
  }

  onSave(pedido: Pedido) {
    console.log('PedidoForm:', this.pedidoForm);
    // console.log('Save pedido:', pedido);
    // this.facade.saveToCart(pedido);
  }

  async addPartida() {
    const params = this.pedidoForm.getEditItemParams();
    const item = await this.itemService.addPartida(params);
    if (item) {
      this.pedidoForm.addPartida({ ...item, id: this.facade.createId() });
    }
  }

  onSumaryChanged(summary: PedidoSummary) {
    this.summary = summary;
  }
  onParamsChanged(event: PedidoParams) {
    this.params = event;
  }
  onErrors(event: ValidationErrors | null) {
    this.errors = event;
  }

  async onDescuentoAlert(event: any) {
    const toast = await this.toastController.create({
      message: `Está a $${event.faltante} de alcanzar el descuento del ${event.descuento}%`,
      color: 'warning',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          icon: 'checkmark',
        },
      ],
    });
    toast.present();
  }

  async showOptions() {
    console.log('Show options...');
    const actionSheet = await this.actionSheetController.create({
      header: 'Operaciones',
      cssClass: 'pedido-options',
      buttons: this.buildActions(),
    });

    await actionSheet.present();
  }

  async aplicarDescuentoEspecial() {
    const alert = await this.alertController.create({
      cssClass: 'alert-descuento-especial',
      header: 'Descuento especial',
      inputs: [
        {
          name: 'descuento',
          type: 'number',
          value: 0.0,
          placeholder: 'Descuento %',
          attributes: {
            min: 0.5,
            max: 50,
          },
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          // handler: () => console.log('Confirm Cancel'),
        },
        {
          text: 'Aceptar',
          handler: (data) =>
            this.pedidoForm.setDescuentoEspecial(data.descuento),
        },
      ],
    });

    await alert.present();
  }

  buildActions() {
    const buttons = [];
    buttons.push(this.buildDeleteBtn());
    if (this.pedidoForm.form.get('tipo').value === TipoDePedido.CONTADO)
      buttons.push(this.buildDescuentoEspecialBtn());

    return buttons;
  }

  buildDescuentoEspecialBtn() {
    return {
      text: 'Descuento especial',
      handler: () => this.aplicarDescuentoEspecial(),
    };
  }

  buildDeleteBtn() {
    return {
      text: 'Eliminar',
      role: 'destructive',
      icon: 'trash',
      handler: () => {
        console.log('Eliminar pedido');
      },
    };
  }
}
