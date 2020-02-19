import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Cliente, Pedido, Socio } from '@swrx/core-model';
import * as moment from 'moment';

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
  @Input() inicio: any;
  constructor() {}

  ngOnInit() {}

  fromNow(time: any) {
    return moment(time).fromNow(false);
  }
}
