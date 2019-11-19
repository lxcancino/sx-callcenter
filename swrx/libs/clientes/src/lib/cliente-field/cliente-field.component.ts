import { Component, OnInit, Input, forwardRef } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  catchError
} from 'rxjs/operators';

import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';

@Component({
  selector: 'swrx-cliente-field',
  templateUrl: './cliente-field.component.html',
  styleUrls: ['./cliente-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClienteFieldComponent),
      multi: true
    }
  ]
})
export class ClienteFieldComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'Seleccione el cliente';
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'fill';

  control = new FormControl();

  onChange: any = () => {};
  onTouch: any = () => {};

  selected: any;

  filteredClientes$: Observable<any>;
  apiUrl = 'http://localhost:8080/callcener/api/clientes';
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.filteredClientes$ = this.control.valueChanges.pipe(
      // startWith(''),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(value => this.lookUp(value))
    );
  }

  lookUp(value: string) {
    const params = new HttpParams().set('term', value).set('activos', 'true');
    return this.http
      .get(this.apiUrl, {
        params: params
      })
      .pipe(catchError((response: any) => throwError(response)));
  }

  displayFn(cliente?: any): string | undefined {
    return cliente ? cliente.nombre : undefined;
  }

  onSelection(event: any) {
    this.selected = event;
    this.onChange(event);
    this.onTouch(event);
  }

  isDeCredito() {
    return this.selected ? this.selected.credito : false;
  }

  /*** ControlValueAccessor implementation ***/

  writeValue(obj: any): void {
    this.control.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  /*** END ControlValueAccessor implementation ***/
}
