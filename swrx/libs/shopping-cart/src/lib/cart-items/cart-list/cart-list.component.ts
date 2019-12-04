import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { items } from './demo';
import { Observable } from 'rxjs';
import { CartFacade } from '../../+state/cart.facade';

@Component({
  selector: 'swrx-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartListComponent implements OnInit {
  items$: Observable<any>;

  constructor(private cartFacade: CartFacade) {}

  ngOnInit() {
    this.items$ = this.cartFacade.cartItems$;
  }
}
