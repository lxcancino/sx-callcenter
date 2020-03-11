import { Component, OnInit, Input, forwardRef, Inject } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  filter,
  switchMap,
  catchError
} from 'rxjs/operators';

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

  /*
  bancos = [...BANCOS].sort((itemA, itemB) =>
    itemA.nombreCorto
      .toLowerCase()
      .localeCompare(itemB.nombreCorto.toLowerCase())
  );
  */
  bancos: any[] = [];

  @Input() placeholder = 'Seleccione un banco';

  selected: any;
  apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/bancos`;
  }

  ngOnInit() {
    this.loadBancos();
  }

  loadBancos() {
    const params = new HttpParams().set('max', '100');
    return this.http
      .get<any>(this.apiUrl, { params })
      .pipe(catchError((response: any) => throwError(response)))
      .subscribe(data => {
        this.bancos = data.sort((itemA: any, itemB: any) =>
          itemA.nombre.toLowerCase().localeCompare(itemB.nombre.toLowerCase())
        );
      });
  }

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
      return itemA.id === itemB.id;
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
