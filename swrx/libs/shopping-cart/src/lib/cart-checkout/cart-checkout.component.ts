import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'swrx-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartCheckoutComponent implements OnInit {
  entity: any;

  constructor(
    private dialogRef: MatDialogRef<CartCheckoutComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.entity = data.entity;
  }

  ngOnInit() {}

  doSubmit() {
    this.dialogRef.close(this.entity);
  }
}
