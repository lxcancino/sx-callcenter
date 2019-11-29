import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { items } from './demo';

@Component({
  selector: 'swrx-cart-items-list',
  templateUrl: './cart-items-list.component.html',
  styleUrls: ['./cart-items-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemsListComponent implements OnInit {
  items = items;

  constructor() {}

  ngOnInit() {}
}
