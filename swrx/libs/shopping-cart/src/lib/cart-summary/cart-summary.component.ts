import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import round from 'lodash/round';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartSummaryComponent implements OnInit {
  @Input() cartForm: FormGroup;

  constructor() {}

  ngOnInit() {}

  getDecimalPart(value: number) {
    const part = value % 1;
    return round(part, 2) * 100;
  }

  get importe() {
    return this.cartForm.get('importe').value;
  }
  get descuento() {
    return this.cartForm.get('descuento').value;
  }
  get descuentoImporte() {
    return this.cartForm.get('descuentoImporte').value;
  }
  get subtotal() {
    return this.cartForm.get('subtotal').value;
  }
  get impuesto() {
    return this.cartForm.get('impuesto').value;
  }
  get total() {
    return this.cartForm.get('total').value;
  }
}
