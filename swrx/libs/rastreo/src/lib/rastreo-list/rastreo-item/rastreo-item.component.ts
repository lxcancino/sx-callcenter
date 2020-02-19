import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Pedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-rastreo-item',
  templateUrl: './rastreo-item.component.html',
  styleUrls: ['./rastreo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RastreoItemComponent implements OnInit {

  isLinear = false;
  @Input() pedido: Pedido;
  
  constructor() { }

  ngOnInit() {
  }

}
