import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sxcc-tipo-de-pedido',
  template: `
    <ion-item [formGroup]="parent">
      <ion-label position="floating">{{ label }}</ion-label>
      <ion-select
        placeholder="Select One"
        interface="popover"
        [formControlName]="property"
      >
        <ion-select-option [value]="t.clave" *ngFor="let t of tipos">
          {{ t.descripcion }}
        </ion-select-option>
      </ion-select>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TipoDePedidoComponent {
  @Input() parent: FormGroup;
  @Input() tipos = [
    { clave: 'CON', descripcion: 'Contado' },
    { clave: 'CRE', descripcion: 'Crédito' },
    { clave: 'COD', descripcion: 'Envio' },
  ];
  @Input() property = 'tipo';
  @Input() label = 'Tipo';

  customPopoverOptions: any = {
    header: 'Tipo de pedido',
    subHeader: 'Seleccione el tipo de pedido',
    message: 'Only select your dominant hair color',
  };

  constructor() {}
}
