import { Component, OnInit, Input, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BANCOS } from './bancos-data';

@Component({
  selector: 'swrx-banco-field',
  templateUrl: './banco-field.component.html',
  styleUrls: ['./banco-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BancoFieldComponent),
      multi: true
    }
  ]
})
export class BancoFieldComponent implements OnInit, ControlValueAccessor {
  onChange: any;
  onTouch: any;

  disabled = false;

  bancos = [...BANCOS].sort((itemA, itemB) =>
    itemA.clave.toLowerCase().localeCompare(itemB.clave.toLowerCase())
  );

  @Input() placeholder = 'Seleccione un banco';

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
