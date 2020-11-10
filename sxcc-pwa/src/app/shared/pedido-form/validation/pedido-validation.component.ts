import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { BaseComponent } from '@shared/common';
import { BehaviorSubject, Observable } from 'rxjs';

import { takeUntil, startWith, map, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'sxcc-pedido-validation',
  template: `
    <ion-grid *ngIf="errors$ | async as errores">
      <ion-row>
        <ion-col *ngIf="errores.length" size-md="6">
          <ion-list class="ion-no-padding" *ngIf="visible$ | async">
            <ion-list-header>
              <ion-label>Errores</ion-label>
              <ion-button color="tertiary" (click)="close()">
                <ion-icon name="close"></ion-icon>
                Cerrar
              </ion-button>
            </ion-list-header>
            <ion-item *ngFor="let e of errores">
              <ion-label color="danger">
                {{ getDescripcion(e) }}
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoValidationComponent extends BaseComponent implements OnInit {
  @Input() parent: FormGroup;
  visible$ = new BehaviorSubject<boolean>(true); // Required to use OnPush detection esasy
  errors$: Observable<string[]>;

  constructor() {
    super();
  }

  ngOnInit() {
    this.errors$ = this.parent.statusChanges.pipe(
      startWith('VALID'),
      map(() => this.parent.errors || {}),
      map((errors) => Object.keys(errors)),
      tap((errors) => this.visible$.next(errors.length > 0))
    );
  }

  setVisible() {
    this.visible$.next(true);
  }

  close() {
    this.visible$.next(false);
  }

  getDescripcion(key: string) {
    switch (key) {
      case 'importeMaximo':
        return 'Importe máximo en ventas de contado es $100,000.00';
      case 'importeMinimo':
        return 'Importe mínimo para facturación: $10.00';
      case 'formaDePagoInvalidaEnCod':
        return 'En COD sólo se permite:  CHEQUE o EFECTIVO o TARJETA';
      case 'postFechadoRequerido':
        return 'Cliente requiere  cheque post fechado';
      case 'chequeNoPermitido':
        return 'Cliente no autorizado a recibir Cheque';
      case 'postFechadoNoPermitido':
        return 'Cheque PSF solo es válido en Crédito';
      case 'enJuridico':
        return 'Cliente en trámite jurídico';
      case 'chequesDevueltos':
        return 'Cliente con cheque devuelto';
      case 'socioRequerido':
        return 'Socio de la union requerido';
      default:
        return key;
    }
  }
}
