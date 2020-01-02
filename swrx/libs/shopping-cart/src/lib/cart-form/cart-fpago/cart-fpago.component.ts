import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormaDePago } from '@swrx/core-model';

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
        width: 170px;
        font-size: 14px;
        margin-left: 5px;
        margin-right: 5px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartFpagoComponent implements OnInit {
  @Input() formasDePago = [
    FormaDePago.TRANSFERENCIA,
    FormaDePago.DEPOSITO,
    FormaDePago.EFECTIVO,
    FormaDePago.TARJETA_CRE,
    FormaDePago.TARJETA_DEB,
    FormaDePago.CHEQUE,
    FormaDePago.CHEQUE_PSTF,
    FormaDePago.NO_DEFINIDO
  ];
  @Input() cartForm: FormGroup;

  constructor() {}

  ngOnInit() {}
}
