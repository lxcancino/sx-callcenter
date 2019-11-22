import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormaDePago } from '../../+state/cart.models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-cart-fpago',
  template: `
    <mat-form-field class="forma-de-pago-field" [formGroup]="cartForm">
      <mat-label>FORMA DE PAGO</mat-label>
      <mat-select placeholder="F. Pago" formControlName="formaDePago">
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
  @Input() cartForm: FormGroup;

  constructor() {}

  ngOnInit() {}
}
