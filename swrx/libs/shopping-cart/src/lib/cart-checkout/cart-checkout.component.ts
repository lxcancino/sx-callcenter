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
  

  constructor(
    private dialogRef: MatDialogRef<CartCheckoutComponent, {id: string, changes: Partial<Pedido>}>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.id = data.id;
    this.changes = data.changes;
  }

  ngOnInit() {}

  doSubmit() {
    this.dialogRef.close({id: this.id, changes: this.changes});
  }
}
