import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Pedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartCheckoutComponent implements OnInit {
  id: string;
  changes: Partial<Pedido>;
  user: any;

  constructor(
    private dialogRef: MatDialogRef<
      CartCheckoutComponent,
      { id: string; changes: Partial<Pedido> }
    >,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.id = data.id;
    this.changes = data.changes;
    this.user = data.user;
  }

  ngOnInit() {
    console.log('Checkout data:', this.data);
    // console.log('Checkout pedido: ', this.changes);
    // console.log('User: ', this.user);
  }

  doSubmit() {
    this.changes.updateUser = this.user.displayName;
    if (!this.changes.createUser) {
      this.changes.createUser = this.user.displayName;
    }
    this.dialogRef.close({ id: this.id, changes: this.changes });
  }
}
