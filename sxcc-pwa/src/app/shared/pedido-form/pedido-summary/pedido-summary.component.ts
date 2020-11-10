import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PedidoSummary } from '@models';
import { PedidoFormBuilderService } from '../pedido-form.builder.service';

@Component({
  selector: 'sxcc-pedido-sumary',
  template: `
    <ion-list>
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
    <ion-grid>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoSumaryComponent implements OnInit {
  @Input() summary: PedidoSummary;
  @Input() parent: FormGroup;
  constructor(private formService: PedidoFormBuilderService) {}

  ngOnInit() {}

  get especial() {
    return this.formService.controls.descuentoEspecial.value > 0;
  }
}
