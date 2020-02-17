import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Renderer2,
  ElementRef,
  forwardRef,
  Self,
  Optional,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validator,
  AbstractControl,
  NG_VALIDATORS,
  NgControl,
  Validators
} from '@angular/forms';
import { MatFormFieldControl, MatInput } from '@angular/material';

/**
 * PENDIENTE DE TERMINAR
 */
@Component({
  selector: 'swrx-upper-case-field',
  template: `
    <mat-form-field [style.width.%]="100" [appearance]="appearance">
      <mat-label>{{ placeholder }}</mat-label>
      <input
        #input
        matInput
        [placeholder]="placeholder"
        autocomplete="off"
        (input)="change($event)"
        [required]="required"
        (blur)="onBlur()"
      />
      <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
      <mat-error *ngIf="controlDir && !controlDir.control.valid">
        {{ getErrorMessage() }}
      </mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpperCaseFieldComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() required = false;
  @Input() appearance = 'legacy';
  @Input() hint = null;

  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild(MatInput, { static: true }) inputField: MatInput;
  onChange;
  onTouched;

  constructor(
    private renderer: Renderer2,
    @Optional()
    @Self()
    public controlDir: NgControl
  ) {
    controlDir.valueAccessor = this;
  }

  ngOnInit() {
    const control = this.controlDir.control;
    if (this.required === true) {
      const validators = control.validator
        ? [control.validator, Validators.required]
        : Validators.required;

      control.setValidators(validators);
      control.updateValueAndValidity();
    }
    this.inputField.ngControl = this.controlDir; // IMPORTANTE Vincular el matInput con el ngControl
  }

  writeValue(obj: any): void {
    const input = this.input.nativeElement;
    this.renderer.setProperty(input, 'value', obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.input.nativeElement, 'disabled', isDisabled);
  }

  change($event) {
    const value = $event.target.value;
    const upper = value.toUpperCase();
    this.renderer.setProperty(this.input.nativeElement, 'value', upper);
    this.onChange(this.input.nativeElement.value);
  }

  onBlur() {
    this.onTouched();
  }

  getErrorMessage() {
    if (this.controlDir.control.getError('required')) {
      return 'Campo requreido';
    } else if (this.controlDir.control.getError('minlength')) {
      const error = this.controlDir.getError('minlength');
      return `Longitud inválida mínimo requerido ${error.requiredLength}`;
    } else if (this.controlDir.control.getError('maxlength')) {
      const error = this.controlDir.getError('maxlength');
      return `Longitud inválida máximo permitido ${error.requiredLength}`;
    } else {
      // console.log('Errors: ', this.controlDir.control.errors);
      return 'Valor inválido';
    }
  }
}
