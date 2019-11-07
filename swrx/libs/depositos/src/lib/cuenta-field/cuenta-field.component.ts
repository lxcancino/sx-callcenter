import { Component, OnInit, Input, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CUENTAS } from './cuentas.data';

@Component({
  selector: 'swrx-cuenta-field',
  templateUrl: './cuenta-field.component.html',
  styleUrls: ['./cuenta-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CuentaFieldComponent),
      multi: true
    }
  ]
})
export class CuentaFieldComponent implements OnInit, ControlValueAccessor {
  disabled = false;

  cuentas = [...CUENTAS]
    .filter(item => item.disponibleEnVenta)
    .sort((itemA, itemB) =>
      itemA.clave.toLowerCase().localeCompare(itemB.clave.toLowerCase())
    );

  onChange: (_: any) => {};
  onTouch: (_: any) => {};

  @Input() placeholder = 'Seleccione una cuenta de destino';

  selected: any;

  constructor() {}

  ngOnInit() {}

  onSelection(event: any) {
    this.selected = event.value;
    if (this.onChange) {
      this.onChange(this.selected);
    }
    if (this.onTouch) {
      this.onTouch(true);
    }
  }

  compareWith(itemA, itemB: any) {
    if (itemA && itemB) {
      return itemA.clave === itemB.clave;
    } else {
      return false;
    }
  }

  writeValue(obj: any): void {
    this.selected = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
