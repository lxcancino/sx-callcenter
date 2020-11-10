import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PedidoDet, TipoDePedido } from '@models';

@Component({
  selector: 'sxcc-pedido-item',
  templateUrl: './pedido-item.component.html',
  styleUrls: ['./pedido-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemComponent implements OnInit {
  @Input() item: PedidoDet;
  @Input() index = 0;
  @Input() odd = false;
  @Input() tipo: TipoDePedido;
  @Input() contadoColor = 'primary';
  @Input() creditoColor = 'secondary';
  @Output() delete = new EventEmitter<number>();
  constructor() {}

  ngOnInit() {}

  get precioCredito() {
    return this.item.producto.precioCredito;
  }
  get precioContado() {
    return this.item.producto.precioContado;
  }

  isCredito() {
    return this.tipo === TipoDePedido.CREDITO;
  }

  getPrecioColor() {
    return this.isCredito() ? 'secondary' : 'primary';
  }
}
