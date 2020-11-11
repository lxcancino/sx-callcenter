import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClienteDireccion } from '@models';

@Component({
  selector: 'sxcc-envio-direcciones',
  template: `
    <ion-item [formGroup]="parent">
      <ion-label position="floating">{{ label }}</ion-label>
      <ion-select
        placeholder="Select One"
        interface="popover"
        [formControlName]="property"
      >
        <ion-select-option [value]="d" *ngFor="let d of direcciones">
          {{ d.nombre }}
        </ion-select-option>
      </ion-select>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvioDireccionesComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() label = 'Direcciones registradas';
  @Input() property = 'direccion';
  direcciones: ClienteDireccion[] = [];
  constructor() {}

  ngOnInit() {}
}
