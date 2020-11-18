import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PedidoSummary } from '@models';

import capitalize from 'lodash-es/capitalize';
import words from 'lodash-es/words';

@Component({
  selector: 'sxcc-pedido-sumary',
  template: `
    <ion-grid [formGroup]="parent">
      <ion-row>
        <ion-col>
          <ion-list [formGroup]="parent" class="ion-no-padding">
            <ion-item>
              <ion-label> Importe: </ion-label>
              {{ summary.importe | currency }}
            </ion-item>
            <ion-item>
              <ion-label>
                Descuento:
                <span class="ion-padding-start">
                  ({{ summary.descuento / 100 | percent }})</span
                >
                <span class="ion-padding-start" *ngIf="especial">
                  <ion-badge color="warning">Especial</ion-badge>
                </span>
              </ion-label>
              {{ summary.descuentoImporte | currency }}
            </ion-item>
            <ion-item>
              <ion-label> Subtotal: </ion-label>
              {{ summary.impuesto | currency }}
            </ion-item>
            <ion-item>
              <ion-label> Impuesto: </ion-label>
              {{ summary.impuesto | currency }}
            </ion-item>
            <ion-item>
              <ion-label> Total: </ion-label>
              <ion-text color="primary">
                {{ summary.total | currency }}
              </ion-text>
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Uso de CFDI</ion-label>
            <ion-select
              placeholder="Seleccione el uso adecuado"
              interface="popover"
              [interfaceOptions]="cfdiPopoverOptions"
              formControlName="usoDeCfdi"
              [compareWith]="compareWith"
            >
              <ion-select-option [value]="t.clave" *ngFor="let t of usos">
                {{ t.descripcion }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-note
            [style.width.%]="100"
            color="danger"
            *ngIf="parent.get('usoDeCfdi').hasError('required')"
          >
            <p>Se requiere un uso de CFDI</p>
          </ion-note>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">CFDI Email</ion-label>
            <ion-input
              type="email"
              formControlName="cfdiMail"
              placeholder="Email para envio de CFDI"
            ></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Comentario </ion-label>
            <ion-textarea
              formControlName="comentario"
              placeholder="Comentario general del pedido"
            ></ion-textarea>
          </ion-item>
          <ion-note
            color="danger"
            class="ion-padding ion-text-end"
            *ngIf="parent.get('comentario').hasError('maxlength')"
          >
            Númer máximo de caracteres 255
          </ion-note>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Comprador </ion-label>
            <ion-input
              formControlName="comprador"
              debounce="500"
              class="ion-text-capitalize"
              (ionChange)="setComprador($event)"
            ></ion-input>
          </ion-item>
          <ion-note
            color="danger"
            class="ion-padding ion-text-end"
            [style.width.%]="100"
            *ngIf="parent.get('comprador').hasError('maxlength')"
          >
            Númer máximo de caracteres 50
          </ion-note>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col>
          <pre>
            {{ parent.value | json }}
          </pre
          >
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoSumaryComponent implements OnInit {
  @Input() summary: PedidoSummary;
  @Input() parent: FormGroup;
  @Input() usos = [
    { clave: 'G01', descripcion: 'ADQUISICIÓN DE MERCANCIAS (G01)' },
    { clave: 'G03', descripcion: 'GASTOS EN GENERAL (G03)' },
    { clave: 'P01', descripcion: 'POR DEFINIR (P01)' },
  ];
  cfdiPopoverOptions: any = {
    header: 'Usos de CFDI',
    cssClass: 'cfdi-field',
  };
  constructor() {}

  ngOnInit() {}

  get especial() {
    return this.parent.get('descuentoEspecial').value > 0;
  }

  compareWith(objA: any, objB: any) {
    return objA && objB ? objA.clave === objB.clave : objA === objB;
  }

  setComprador({ detail: { value } }) {
    this.parent.get('comprador').patchValue(
      words(value)
        .map((i) => capitalize(i))
        .join(' '),
      { emitEvent: false }
    );
  }
}
