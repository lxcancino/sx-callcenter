import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DummyItem } from '@data-access/+state/pedidos/dummy';
import { PedidoDet, TipoDePedido } from '@models';

@Component({
  selector: 'sxcc-pedido-items-list',
  template: `
    <ion-list lines="full">
      <sxcc-pedido-item
        *ngFor="let item of partidas; index as idx; odd as odd"
        [item]="item"
        [tipo]="tipo"
        [index]="idx"
        [odd]="odd"
      ></sxcc-pedido-item>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemsListComponent implements OnInit {
  @Input() partidas: PedidoDet[] = [DummyItem, DummyItem, DummyItem, DummyItem];
  @Input() tipo: TipoDePedido;
  constructor() {}

  ngOnInit() {}
}
