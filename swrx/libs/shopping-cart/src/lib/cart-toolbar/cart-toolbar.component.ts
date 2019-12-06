import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { Cliente, TipoDePedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-toolbar',
  templateUrl: './cart-toolbar.component.html',
  styleUrls: ['./cart-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartToolbarComponent implements OnInit {
  @Input() cliente: Cliente;
  constructor() {}

  ngOnInit() {
    const tipo = TipoDePedido.CONTADO;
    console.log('Tipo: ', TipoDePedido['COD']);
  }

  seleccionarCliente() {}
}
