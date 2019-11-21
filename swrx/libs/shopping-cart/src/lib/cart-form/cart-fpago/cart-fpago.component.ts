import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormaDePago } from '../../+state/cart.models';

@Component({
  selector: 'swrx-cart-fpago',
  template: `
    <mat-form-field class="forma-de-pago-field">
      <mat-label>FORMA DE PAGO</mat-label>
      <mat-select placeholder="F. Pago">
        <mat-option *ngFor="let f of formasDePago" [value]="f">
          {{ f }}
        </mat-option>
      </mat-select>
      <mat-error>
        DEBE SELECCIONAR UN TIPO DE VENTA
      </mat-error>
    </mat-form-field>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartFpagoComponent implements OnInit {
  @Input() formasDePago = [
    FormaDePago.EFECTIVO,
    FormaDePago.TARJETA_CREDITO,
    FormaDePago.TARJETA_DEBITO,
    FormaDePago.CHEQUE,
    FormaDePago.NO_DEFINIDO
  ];

  constructor() {}

  ngOnInit() {}
}
