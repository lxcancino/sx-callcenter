import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'swrx-cart-add-item',
  templateUrl: './cart-add-item.component.html',
  styleUrls: ['./cart-add-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartAddItemComponent implements OnInit {
  private item: any;
  private form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialoRef: MatDialogRef<CartAddItemComponent>,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      producto: [null, Validators.required],
      cantidad: [0, Validators.required],
      precio: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialoRef.close(this.form.value);
    }
  }
}
