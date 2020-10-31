import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Sucursal } from 'src/app/models';

@Component({
  selector: 'sxcc-sucursal',
  template: `
    <ion-item [formGroup]="parent">
      <ion-label position="floating">{{ label }}</ion-label>
      <ion-select
        placeholder="Sucursal"
        interface="popover"
        [formControlName]="property"
      >
        <ion-select-option [value]="s.id" *ngFor="let s of sucursales">
          {{ s.nombre }}
        </ion-select-option>
      </ion-select>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucursalComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() sucursales: Sucursal[] = [];
  @Input() property = 'sucursal';
  @Input() label = 'Sucursal';

  customPopoverOptions: any = {
    header: 'Sucursal',
    subHeader: 'Seleccione la sucursal de venta',
    message: 'Message ??',
  };

  constructor() {}

  ngOnInit() {}
}
