import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'swrx-cart-uso',
  template: `
    <mat-form-field class="uso-field">
      <mat-label>USO CFDI</mat-label>
      <mat-select placeholder="USO CFDI">
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
        width: 150;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartUsoComponent implements OnInit {
  @Input() usos = [
    { clave: 'G01', descripcion: 'ADQUISICIÓN DE MERCANCIAS' },
    { clave: 'G03', descripcion: 'GASTOS EN GENERAL' },
    { clave: 'P01', descripcion: 'POR DEFINIR' }
  ];
  constructor() {}

  ngOnInit() {}
}
