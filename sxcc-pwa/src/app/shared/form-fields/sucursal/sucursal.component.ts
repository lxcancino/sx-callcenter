import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CatalogosService } from '@data-access/services/catalogos.service';
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
        [compareWith]="compareWith"
      >
        <ion-select-option [value]="s" *ngFor="let s of sucursales$ | async">
          {{ s.nombre }}
        </ion-select-option>
      </ion-select>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucursalComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() property = 'sucursal';
  @Input() label = 'Sucursal';

  sucursales$ = this.service.sucursales$;

  customPopoverOptions: any = {
    header: 'Sucursal',
    subHeader: 'Seleccione la sucursal de venta',
    message: 'Message ??',
  };

  constructor(private service: CatalogosService) {}

  ngOnInit() {}

  compareWith(currentValue: any, compareValue: any) {
    if (!compareValue) {
      return false;
    }
    return currentValue.id === compareValue.id;
  }
}
