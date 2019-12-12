import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CartItem } from '../../../+state/cart.models';

@Component({
  selector: 'swrx-cart-list-item',
  templateUrl: './cart-list-item.component.html',
  styleUrls: ['./cart-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartListItemComponent implements OnInit {
  @Input() item;
  @Output() edit = new EventEmitter<Partial<CartItem>>();
  @Output() delete = new EventEmitter<Partial<CartItem>>();

  constructor() {}

  ngOnInit() {}
}
