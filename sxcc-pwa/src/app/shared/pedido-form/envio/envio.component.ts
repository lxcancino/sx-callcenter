import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { buildDireccionForm } from '@utils';

@Component({
  selector: 'sxcc-envio',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col size="12" size-md="6">
          <sxcc-envio-tipo [parent]="form"></sxcc-envio-tipo>
        </ion-col>
        <ion-col size="12" size-md="6">
          <sxcc-transporte [parent]="form"></sxcc-transporte>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <sxcc-envio-direcciones [parent]="form"></sxcc-envio-direcciones>
        </ion-col>
      </ion-row>
      <ion-row [formGroup]="form">
        <ion-col size="12" size-md="6">
          <ion-item>
            <ion-label position="floating">Contacto *</ion-label>
            <ion-input
              formControlName="contacto"
              class="ion-text-capitalize"
            ></ion-input>
          </ion-item>
          <ion-note
            color="danger"
            *ngIf="controls.contacto.hasError('required') && form.dirty"
          >
            Se reqyiere el nombre del contacto
          </ion-note>
        </ion-col>
        <ion-col size="12" size-md="6">
          <ion-item>
            <ion-label position="floating">Teléfono</ion-label>
            <ion-input type="tel" formControlName="telefono"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>

      <ion-row [formGroup]="form">
        <ion-col size="12" size-md="6">
          <ion-item>
            <ion-label position="floating">Fecha de entrega</ion-label>
            <ion-datetime
              cancelText="Cancelar"
              doneText="Seleccionar"
              displayFormat="DD, MMM YYYY "
              [dayShortNames]="customDayShortNames"
              [monthShortNames]="monthShortNames"
              formControlName="fechaDeEntrega"
            ></ion-datetime>
          </ion-item>
        </ion-col>
        <ion-col size="6" size-md="3">
          <ion-item>
            <ion-label position="floating">Entregar de:</ion-label>
            <ion-datetime
              mode="ios"
              displayFormat="hh:mm A"
              pickerFormat="HH:mm"
              doneText="Aceptar"
              cancelText="Cancelar"
              minuteValues="0,15,30,45"
              formControlName="horarioInicial"
            ></ion-datetime>
          </ion-item>
        </ion-col>
        <ion-col size="6" size-md="3">
          <ion-item>
            <ion-label position="floating">a:</ion-label>
            <ion-datetime
              mode="ios"
              displayFormat="hh:mm A"
              pickerFormat="HH:mm"
              doneText="Aceptar"
              cancelText="Cancelar"
              minuteValues="0,15,30,45"
              formControlName="horarioFinal"
            ></ion-datetime>
          </ion-item>
        </ion-col>
      </ion-row>

      <ion-row [formGroup]="form">
        <ion-col>
          <ion-item>
            <ion-label position="floating">Comentario </ion-label>
            <ion-textarea
              formControlName="comentario"
              class="ion-text-capitalize"
            ></ion-textarea>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvioComponent implements OnInit {
  @Input() parent: FormGroup;
  form: FormGroup;
  customDayShortNames = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
  monthShortNames = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dec',
  ];

  horarioOptions: any;
  customPickerOption: any;
  controls: any;
  horaroIni: string;

  constructor(private fb: FormBuilder) {
    this.horarioOptions = {
      text: 'Log',
      handler: () => console.log(''),
    };
  }

  ngOnInit() {
    this.form = this.parent.get('envio') as FormGroup;
    this.controls = {
      tipo: this.form.controls.tipo,
      contacto: this.form.controls.contacto,
    };

    const now = new Date();
    now.setHours(9, 0);
    this.horaroIni = now.toISOString();
  }

  setHorario(event: any) {
    console.log('Horario: ', event);
  }

  setFechaDeEngrega({ detail }) {
    console.log('Fecha de entrega: ', detail);
  }
}
