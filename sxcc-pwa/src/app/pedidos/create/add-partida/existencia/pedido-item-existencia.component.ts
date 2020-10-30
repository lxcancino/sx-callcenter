import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Producto } from '@models';

@Component({
  selector: 'sxcc-pedido-item-exis',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label>Existencia Total:</ion-label>
            <ion-input type="number" disabled></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col
          *ngFor="let item of existencia$ | keyvalue"
          size-md="3"
          size-sm="6"
        >
          <ion-item>
            <ion-label position="floating">{{ item.value.nombre }}</ion-label>
            <ion-input
              [value]="item.value.cantidad"
              disabled
              color="success"
            ></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoItemExistenciaComponent implements OnInit {
  @Input() producto: Producto;

  existencia$ = {
    andrade: { nombre: 'Andrade', cantidad: 100, recorte: 0 },
    bolivar: { nombre: 'Bolivar', cantidad: 100, recorte: 0 },
    calle4: { nombre: 'Calle 4', cantidad: 100, recorte: 0 },
    tacuba: { nombre: 'Tacuba', cantidad: 100, recorte: 0 },
  };

  constructor() {}

  ngOnInit() {}
}
