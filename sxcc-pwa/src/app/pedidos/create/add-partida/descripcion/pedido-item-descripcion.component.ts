import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Producto } from '@models';

@Component({
  selector: 'sxcc-pedido-item-descripcion',
  template: `
    <ion-list>
      <ion-item>
        <ion-label>
          <h2>{{ getDescripcion() }}</h2>
          <p>
            {{ producto ? producto.linea['linea'] : '' }}
            <span>
              {{ producto ? producto.unidad : '' }}
            </span>
          </p>
        </ion-label>
        <ion-note *ngIf="producto" color="warning">
          {{ producto.modoVenta === 'B' ? 'Precio Neto' : 'Precio Bruto' }}
        </ion-note>
      </ion-item>
    </ion-list>
  `,
})
export class PedidoItemDescripcionComponent implements OnInit {
  // @Input() producto: Producto;
  @Input() parent: FormGroup;
  constructor() {}

  ngOnInit() {}

  getDescripcion() {
    return this.producto
      ? this.producto.descripcion
      : 'Descripción del producto';
  }

  /**
   * Extract the product from the parent form
   */
  get producto(): Partial<Producto> {
    return this.parent.get('producto').value;
  }

  get precio() {
    return this.parent.get('precio').value;
  }
}
