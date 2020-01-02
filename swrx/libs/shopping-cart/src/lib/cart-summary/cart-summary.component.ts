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
  @Input() disabled = false;
  @Output() checkout = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  getDecimalPart(value: number) {
    const part = value % 1;
    return part.toFixed(2).substring(2);
  }

  getIntegarPart(value: number) {
    return Math.trunc(value);
  }
}
