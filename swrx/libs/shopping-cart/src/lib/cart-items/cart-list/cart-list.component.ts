import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { items } from './demo';

@Component({
  selector: 'swrx-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartListComponent implements OnInit {
  items = items;

  constructor() {}

  ngOnInit() {
    const data = items;
    let row = 0;
    this.items = data.map(i => {
      const res: any = { ...i };
      if (row % 2 === 0) {
        res.imageUrl = 'assets/images/1273567240.jpg';
      } else {
        res.imageUrl = 'assets/images/1182974789.jpg';
      }
      if (i.corte) {
        console.log('Corte: ', i.corte);
      }
      row++;
      return res;
    });
  }
}
