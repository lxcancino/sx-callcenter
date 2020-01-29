import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CartItem } from '../+state/cart.models';
import { generarCargoPorFlete } from '../+state/cart-cargos-utils';
import { Pedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-maniobra',
  templateUrl: './cart-maniobra.component.html',
  styleUrls: ['./cart-maniobra.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartManiobraComponent implements OnInit {
  item: CartItem;
  control = new FormControl(null, [Validators.required, Validators.min(10)]);
  pedido: Pedido;
  envio;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CartManiobraComponent, CartItem>
  ) {
    const partidas: CartItem[] = Object.values(data.items);
    this.item =
      partidas.find((item: CartItem) => item.clave === 'MANIOBRAF') ||
      generarCargoPorFlete();
    this.pedido = data.pedido;
    this.envio = data.envio;
    console.log('Envio: ', this.envio);
  }

  ngOnInit() {
    this.control.setValue(this.item.precio);
  }

  onSubmit() {
    if (this.control.valid) {
      const precio = this.control.value;
      this.item.producto.precioContado = precio;
      this.item.producto.precioCredito = precio;
      this.dialogRef.close(this.item);
    }
  }
  isValid() {
    return this.envio && this.envio.tipo === 'ENVIO_CARGO';
  }
  invalidMessage() {
    return this.envio === null
      ? 'Pedido sin envio'
      : 'El tipo del envio debe ser ENVIO_CARGO';
  }
}
