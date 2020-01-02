import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DESCUENTOS } from '../../+state/cart.utils';

@Component({
  selector: 'swrx-cart-descuentos',
  templateUrl: './cart-descuentos.component.html',
  styleUrls: ['./cart-descuentos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartDescuentosComponent implements OnInit {
  importe: number;
  descuento: number;
  tipo: any;
  descuentos: { descuento: number; importe: any }[];
  displayedColumns: string[] = ['importe', 'descuento'];
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.importe = data.importe;
    this.descuento = data.descuento;
    this.tipo = data.tipo;
    this.descuentos = [...DESCUENTOS];
  }

  ngOnInit() {
    console.log('Dialog DATA: ', this.data);
  }
}
