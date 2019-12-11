import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'swrx-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
