import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Cliente, Pedido, Socio } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-toolbar',
  templateUrl: './cart-toolbar.component.html',
  styleUrls: ['./cart-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartToolbarComponent implements OnInit {
  @Input() cliente: Cliente;
  @Input() pedido: Pedido;
  @Input() nombre: string;
  @Output() cambiarNombre = new EventEmitter();
  @Output() seleccionarSocio = new EventEmitter();
  @Input() socio: Socio;
  constructor() {}

  ngOnInit() {}
}
