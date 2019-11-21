import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'swrx-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
