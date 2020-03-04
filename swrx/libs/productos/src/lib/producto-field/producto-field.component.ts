import { Component, OnInit, Input, forwardRef, Inject } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  filter,
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
  selector: 'swrx-producto-field',
  templateUrl: './producto-field.component.html',
  styleUrls: ['./producto-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductoFieldComponent),
      multi: true
    }
  ]
})
export class ProductoFieldComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'Buscar producto';
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'fill';

  control = new FormControl();
  selected: any;

  filteredProducts$: Observable<any>;
  apiUrl: string;

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/productos`;
  }

  ngOnInit() {
    this.filteredProducts$ = this.control.valueChanges.pipe(
      // startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      filter(value => typeof value === 'string'),
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

  displayFn(producto?: any): string | undefined {
    return producto ? `${producto.clave} ${producto.descripcion}` : undefined;
  }

  onSelection(event: any) {
    this.selected = event;
    this.onChange(event);
    this.onTouch(event);
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
