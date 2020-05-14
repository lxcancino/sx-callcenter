import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-pedido-view',
  templateUrl: './pedido-view.component.html'
})
export class PedidoViewComponent implements OnInit {
  @Input() pedido: Pedido[]
  constructor() { }

  ngOnInit() { }
}
