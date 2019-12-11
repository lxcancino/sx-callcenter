import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import round from 'lodash/round';

import { CartSumary } from '../+state/cart.models';

@Component({
  selector: 'swrx-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartSummaryComponent implements OnInit {
  @Input() sumary: CartSumary;
  @Output() checkout = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  getDecimalPart(value: number) {
    const part = value % 1.0;
    const res = round(part * 100.0, 2);
    return res;
  }

  getIntegarPart(value: number) {
    return Math.trunc(value);
  }
}
