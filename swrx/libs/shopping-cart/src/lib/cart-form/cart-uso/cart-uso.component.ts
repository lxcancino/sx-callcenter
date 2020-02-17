import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-cart-uso',
  template: `
    <mat-form-field class="uso-field" [formGroup]="cartForm">
      <mat-label>Uso de Cfdi</mat-label>
      <mat-select placeholder="USO CFDI" formControlName="usoDeCfdi">
        <mat-option *ngFor="let uso of usos" [value]="uso.clave">
          {{ uso.descripcion }}
        </mat-option>
      </mat-select>
      <mat-error>
        DEBE SELECCIONAR UN USO DE CFDI
      </mat-error>
    </mat-form-field>
  `,
  styles: [
    `
      .uso-field {
        width: 300px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartUsoComponent implements OnInit {
  @Input() usos = [
    { clave: 'G01', descripcion: 'ADQUISICIÓN DE MERCANCIAS (G01)' },
    { clave: 'G03', descripcion: 'GASTOS EN GENERAL (G03)' },
    { clave: 'P01', descripcion: 'POR DEFINIR (P01)' }
  ];
  @Input() cartForm: FormGroup;
  constructor() {}

  ngOnInit() {}
}
