import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'swrx-cart-descuentoe',
  templateUrl: './cart-descuentoe.component.html',
  styleUrls: ['./cart-descuentoe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartDescuentoeComponent implements OnInit {
  control = new FormControl(null, Validators.required);
  descuento: number;
  descuentoOriginal: number;

  constructor(
    private dialogRef: MatDialogRef<CartDescuentoeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.descuento = data.descuento;
  }

  ngOnInit() {
    console.log('Data: ', this.data);
    this.control.setValue(this.data.descuentoEspecial || 0.0);
  }

  onSubmit() {
    if (this.control.valid) {
      const res: number = parseFloat(this.control.value);
      this.dialogRef.close(res);
    }
  }
}
