import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'swrx-cart-nombre',
  templateUrl: './cart-nombre.component.html',
  styleUrls: ['./cart-nombre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartNombreComponent implements OnInit {
  control = new FormControl(null, [Validators.required]);

  constructor(
    private dialogRef: MatDialogRef<CartNombreComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {
    this.control.setValue(this.data.nombre);
  }

  onSubmit() {
    if (this.control.valid) {
      this.dialogRef.close(this.control.value);
    }
  }
}
