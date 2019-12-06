import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TipoDePedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-tipo',
  template: `
    <div [formGroup]="cartForm">
      <mat-select placeholder="TIPO" formControlName="tipo" class="tipo-field">
        <mat-option *ngFor="let t of tipos" [value]="t"> {{ t }} </mat-option>
      </mat-select>
      <div></div>
    </div>
  `,
  styles: [
    `
      .tipo-field {
        width: 150px;
        margin-left: 5px;
        margin-right: 5px;
        font-size: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartTipoComponent implements OnInit {
  @Input() cartForm = FormGroup;

  @Input() tipos = [
    TipoDePedido.CONTADO,
    TipoDePedido.CREDITO,
    TipoDePedido.COD,
    TipoDePedido.PSF,
    TipoDePedido.INE
  ];

  constructor() {}

  ngOnInit() {}
}
