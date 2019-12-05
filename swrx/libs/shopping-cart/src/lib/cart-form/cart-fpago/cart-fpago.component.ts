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
    <div class="tipo-field" [formGroup]="cartForm">
      <mat-select placeholder="F. Pago" formControlName="formaDePago">
        <mat-option *ngFor="let f of formasDePago" [value]="f">
          {{ f }}
        </mat-option>
      </mat-select>
    </div>
  `,
  styles: [
    `
      .tipo-field {
        width: 150px;
        font-size: 16px;
        margin-left: 5px;
        margin-right: 5px;
      }
    `
  ],
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
