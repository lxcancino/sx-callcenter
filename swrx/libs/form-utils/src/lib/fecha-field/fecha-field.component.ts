import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'swrx-fecha-field',
  templateUrl: './fecha-field.component.html',
  styleUrls: ['./fecha-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FechaFieldComponent),
      multi: true
    }
  ]
})
export class FechaFieldComponent implements OnInit, ControlValueAccessor {
  @Input() label = 'Fecha';
  @Input() placeholder = 'Fecha';
  _value: any = new Date().toISOString();
  disabled = false;
  @Input() minDate: any;
  @Input() maxDate: any;

  onChanged: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  ngOnInit() {}

  onDateChanged(event: any) {
    if (!this.disabled) {
      const dt = moment(event.value).toISOString()
      console.log('Selected: ', dt);
      this._value = event.value;
      this.onChanged(this._value);
      this.onTouched();
    }
  }

  /** ControlValueAccessor Implementation */
  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
