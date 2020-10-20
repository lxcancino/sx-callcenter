import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sxcc-forma-de-pago',
  template: `
    <ion-item [formGroup]="parent">
      <ion-label position="floating">{{ label }}</ion-label>
      <ion-select
        placeholder="Forma de pago"
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
export class FormaDePagoComponent {
  @Input() parent: FormGroup;

  @Input() tipos = [
    { clave: 'EFECTIVO', descripcion: 'Efectivo' },
    { clave: 'TRANSFERENCIA', descripcion: 'Transferencia' },
    { clave: 'DEPOSITO_EFECTIVO', descripcion: 'Dep efectivo' },
    { clave: 'DEPOSITO_CHEQUE', descripcion: 'Dep cheque' },
    { clave: 'DEPOSITO_MIXTO', descripcion: 'Dep mixto' },
    { clave: 'TARJETA_CRE', descripcion: 'Tarjeta (Cre)' },
    { clave: 'TARJETA_DEB', descripcion: 'Tarjeta (Dev)' },
    { clave: 'CHEQUE', descripcion: 'Cheque' },
    { clave: 'CHEQUE_PSTF', descripcion: 'Cheque (PSF)' },
    { clave: 'NO_DEFINIDO', descripcion: 'No definido' },
  ];
  @Input() property = 'formaDePago';
  @Input() label = 'Forma de pago';

  customPopoverOptions: any = {
    header: 'Tipo de pedido',
    subHeader: 'Seleccione el tipo de pedido',
    message: 'Only select your dominant hair color',
  };

  constructor() {}
}
