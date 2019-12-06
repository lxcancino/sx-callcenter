import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-cart-main-form',
  templateUrl: './cart-main-form.component.html',
  styleUrls: ['./cart-main-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartMainFormComponent implements OnInit {
  @Input() cartForm: FormGroup;

  constructor() {}

  ngOnInit() {}
}
