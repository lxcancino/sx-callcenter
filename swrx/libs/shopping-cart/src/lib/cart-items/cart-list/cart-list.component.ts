import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';
import { CartFacade } from '../../+state/cart.facade';
import { CartItem } from '../../+state/cart.models';

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
  onDelete(item: Partial<CartItem>) {
    this.cartFacade.deleteItem(item);
  }
  onEdit(item: Partial<CartItem>) {
    this.cartFacade.editItem(item);
  }
}
