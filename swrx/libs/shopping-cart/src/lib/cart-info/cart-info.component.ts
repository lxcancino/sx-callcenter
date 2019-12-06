import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CartFacade } from '../+state/cart.facade';

@Component({
  selector: 'swrx-cart-info',
  templateUrl: './cart-info.component.html',
  styleUrls: ['./cart-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartInfoComponent implements OnInit {
  @Input() cartForm: FormGroup;

  constructor(public facade: CartFacade) {}

  ngOnInit() {}
}
