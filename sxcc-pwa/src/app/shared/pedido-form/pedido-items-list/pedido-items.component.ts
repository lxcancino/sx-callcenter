import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ItemReorderEventDetail } from '@ionic/core';
import { PedidoDet, TipoDePedido } from '@models';

@Component({
  selector: 'sxcc-pedido-items-list',
  template: `
    <ion-list lines="full">
      <ion-reorder-group disabled="true" (ionItemReorder)="doReorder($event)">
        <ion-reorder *ngFor="let item of partidas; index as idx; odd as odd">
          <sxcc-pedido-item
            [item]="item"
            [tipo]="tipo"
            [index]="idx"
            [odd]="odd"
          ></sxcc-pedido-item>
        </ion-reorder>
      </ion-reorder-group>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemsListComponent {
  // @Input() partidas: PedidoDet[] = [];
  private _partidas: PedidoDet[] = [];
  @Input() tipo: TipoDePedido;
  constructor() {}

  @Input()
  set partidas(value: PedidoDet[]) {
    this._partidas = value;
  }

  get partidas() {
    return this._partidas;
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete(this.partidas);
  }
}
