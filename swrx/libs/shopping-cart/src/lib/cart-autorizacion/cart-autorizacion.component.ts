import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'swrx-cart-autorizacion',
  templateUrl: './cart-autorizacion.component.html',
  styleUrls: ['./cart-autorizacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartAutorizacionComponent implements OnInit {
  user: any;
  control = new FormControl(null, {
    validators: [Validators.required],
    updateOn: 'blur'
  });
  tags: string;
  pedido: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CartAutorizacionComponent>
  ) {
    this.user = data.user;
    this.tags = data.tags;
    this.pedido = data.pedido;
    console.log('Data: ', this.data);
  }

  ngOnInit() {
    this.control.setValue(this.data.comentario);
  }

  onSubmit() {
    if (this.control.valid) {
      const auth = {
        sucursal: 'CALLCENTER',
        solicita: this.pedido.createUser,
        autoriza: this.user.displayName,
        tags: this.tags,
        comentario: this.control.value
      };
      this.dialogRef.close(auth);
    }
  }
}
