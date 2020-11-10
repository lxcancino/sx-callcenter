import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormaDePago } from '@models';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      <ion-note color="danger" *ngIf="validoEnCod$ | async">
        Inválido en COD
      </ion-note>
      <ion-note color="danger" *ngIf="postFechadoNoPermitido$ | async">
        PSF No permitido
      </ion-note>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormaDePagoComponent implements OnInit {
  @Input() parent: FormGroup;

  @Input() tipos = [
    { clave: FormaDePago.EFECTIVO, descripcion: 'Efectivo' },
    { clave: FormaDePago.TRANSFERENCIA, descripcion: 'Transferencia' },
    { clave: FormaDePago.DEPOSITO_EFECTIVO, descripcion: 'Dep efectivo' },
    { clave: FormaDePago.DEPOSITO_CHEQUE, descripcion: 'Dep cheque' },
    { clave: FormaDePago.DEPOSITO_MIXTO, descripcion: 'Dep mixto' },
    { clave: FormaDePago.TARJETA_CRE, descripcion: 'Tarjeta (Cre)' },
    { clave: FormaDePago.TARJETA_DEB, descripcion: 'Tarjeta (Dev)' },
    { clave: FormaDePago.CHEQUE, descripcion: 'Cheque' },
    { clave: FormaDePago.CHEQUE_PSTF, descripcion: 'Cheque (PSF)' },
    { clave: FormaDePago.NO_DEFINIDO, descripcion: 'No definido' },
  ];
  @Input() property = 'formaDePago';
  @Input() label = 'Forma de pago';
  validoEnCod$: Observable<boolean>;
  postFechadoNoPermitido$: Observable<boolean>;

  customPopoverOptions: any = {
    header: 'Tipo de pedido',
    subHeader: 'Seleccione el tipo de pedido',
    message: 'Only select your dominant hair color',
  };

  constructor() {}

  ngOnInit() {
    this.validoEnCod$ = this.parent.statusChanges.pipe(
      map(() => this.parent.hasError('formaDePagoInvalidaEnCod'))
    );

    this.postFechadoNoPermitido$ = this.parent.statusChanges.pipe(
      map(() => this.parent.hasError('postFechadoNoPermitido'))
    );
  }

  hasErrorInCod() {
    return this.parent.hasError('formaDePagoInvalidaEnCod');
  }
}
