import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-cart-tipo',
  template: `
    <mat-form-field class="tipo-field" [formGroup]="cartForm">
      <mat-label>Tipo</mat-label>
      <mat-select placeholder="TIPO" formControlName="tipo">
        <mat-option *ngFor="let t of tipos" [value]="t"> {{ t }} </mat-option>
      </mat-select>
      <mat-error>
        Debe seleccionar un tipo de venta
      </mat-error>
    </mat-form-field>
  `,
  styles: [
    `
      .tipo-field {
        width: 200px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartTipoComponent implements OnInit {
  @Input() cartForm = FormGroup;

  @Input() tipos = ['COD', 'CRE', 'CON'];

  constructor() {}

  ngOnInit() {}
}
