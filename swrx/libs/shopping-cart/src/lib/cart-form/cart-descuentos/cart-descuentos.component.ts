import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { FormaDePago } from '@swrx/core-model';

@Component({
  selector: 'swrx-cart-descuentos',
  templateUrl: './cart-descuentos.component.html',
  styleUrls: ['./cart-descuentos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartDescuentosComponent implements OnInit {
  importe: number;
  descuento: number;
  proximo: any;
  faltante: number;
  tipo: any;
  // descuentos: { descuento: number; importe: any }[];
  descuentos = [
    { descuento: 0.0, de: 0.0, hasta: 100.0 },
    { descuento: 8.0, de: 100.01, hasta: 1000.0 },
    { descuento: 10.0, de: 1000.01, hasta: 5000.0 },
    { descuento: 12.0, de: 5000.01, hasta: 12000.0 },
    { descuento: 14.0, de: 12000.01, hasta: 21500.0 },
    { descuento: 15.0, de: 21500.01, hasta: 46000.0 },
    { descuento: 16.0, de: 46000.01, hasta: 82000.0 },
    { descuento: 17.0, de: 82000.01, hasta: 150000.0 }
    // { descuento: 18.0, de: 30000000.01, hasta: 30000000.00 }
  ];
  displayedColumns: string[] = ['de', 'hasta', 'descuento'];
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.importe = data.importe;
    this.descuento = data.descuento;
    this.tipo = data.tipo;

    if (this.data.formState.formaDePago === FormaDePago.CHEQUE_PSTF) {
      this.descuentos.forEach(item => {
        if (item.descuento > 0) {
          item.descuento = item.descuento - 4;
        }
      });
    }
  }

  ngOnInit() {
    this.proximo = this.descuentos.find(
      item => item.descuento > this.descuento
    );
  }
}
