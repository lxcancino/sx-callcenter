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
  @Input() index: number;
  @Output() edit = new EventEmitter<Partial<CartItem>>();
  @Output() delete = new EventEmitter<Partial<CartItem>>();

  constructor() {}

  ngOnInit() {}

  onEdit(item: CartItem) {
    if (item.clave !== 'MANIOBRA' && item.clave !== 'CORTE') {
      this.edit.emit(item);
    }
  }

  getKilos(item: CartItem) {
    const factor = item.unidad === 'MIL' ? 1000 : 1;
    const kg = (item.kilos * item.cantidad) / factor;
    return kg.toFixed(3);
  }
}
