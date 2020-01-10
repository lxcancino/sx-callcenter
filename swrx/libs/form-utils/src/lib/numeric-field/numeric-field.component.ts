import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
  ElementRef,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * TODO usar regular expresion: -?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?
 */
@Component({
  selector: 'swrx-numeric-field',
  templateUrl: './numeric-field.component.html',
  styleUrls: ['./numeric-field.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericFieldComponent),
      multi: true
    }
  ]
})
export class NumericFieldComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = '';
  @Input() label = 'Importe';
  @Input() decimals = 2;

  disabled = false;
  _value: any;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  ngOnInit() {}

  onChangeValue(event) {
    if (!this.disabled) {
      const va = parseFloat(event.target.value).toFixed(this.decimals);
      const value = parseFloat(va) || 0.0;

      this._value = value;
      this.onChange(this._value);
      this.onTouched();
    }
  }
  onInput(event) {
    // console.log('On INPUT:', event);
  }
  onEnter(event) {}

  writeValue(obj: any): void {
    this._value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
