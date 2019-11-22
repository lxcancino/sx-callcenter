import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-cart-footer',
  templateUrl: './cart-footer.component.html',
  styleUrls: ['./cart-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartFooterComponent implements OnInit {
  @Input() cartForm: FormGroup;
  constructor() {}

  ngOnInit() {}
}
