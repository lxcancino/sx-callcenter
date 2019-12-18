import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-sucursal-field',
  template: `
    <div class="field" [formGroup]="parent">
      <mat-select placeholder="Sucursal" formControlName="sucursal">
        <mat-option *ngFor="let s of sucursales" [value]="s">
          {{ s }}
        </mat-option>
      </mat-select>
    </div>
  `,
  styles: [
    `
      .field {
        width: 200px;
        font-size: 16px;
        margin-left: 5px;
        margin-right: 5px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SucursalFieldComponent implements OnInit {
  @Input() sucursales = [
    'ANDRADE',
    'BOLIVAR',
    'CALLE4',
    'CF5FEBRERO',
    'TACUBA'
  ];
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {}
}
