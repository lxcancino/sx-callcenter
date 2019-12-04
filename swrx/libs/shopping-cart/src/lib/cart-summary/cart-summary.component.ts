import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
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

  constructor() {}

  ngOnInit() {}

  getDecimalPart(value: number) {
    const part = value % 1;
    return round(part, 2) * 100;
  }
}
