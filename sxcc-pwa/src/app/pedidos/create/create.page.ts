import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { PedidosFacade } from 'src/app/@data-access/+state/pedidos/pedidos.facade';
import { CatalogosService } from 'src/app/@data-access/services/catalogos.service';
import { Cliente, Pedido } from 'src/app/models';
import { LookupClienteComponent } from 'src/app/shared/clientes/lookup-cliente/lookup-cliente.component';
import { PedidoFormComponent } from 'src/app/shared/pedido-form/pedido-form.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  sucursales$ = this.catalogos.sucursales$;
  title$ = new BehaviorSubject('Nuevo pedido');
  pedido$ = this.facade.newPedido$;

  @ViewChild('form') pedidoForm: PedidoFormComponent;

  constructor(
    private catalogos: CatalogosService,
    private facade: PedidosFacade
  ) {}

  ngOnInit() {}

  showOptions() {}

  onClienteSelection(cliente: Cliente) {
    this.pedidoForm.setCliente(cliente);
  }

  onSave(pedido: Pedido) {
    this.facade.saveToCart(pedido);
  }
}
