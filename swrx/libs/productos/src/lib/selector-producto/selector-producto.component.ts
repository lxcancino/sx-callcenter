import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  tap,
  startWith,
  catchError
} from 'rxjs/operators';

import { MatDialogRef } from '@angular/material';

import { Producto } from '@swrx/core-model';

@Component({
  selector: 'swrx-selector-producto',
  templateUrl: './selector-producto.component.html',
  styleUrls: ['./selector-producto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorProductoComponent implements OnInit, AfterViewInit {
  filteredProducts$: Observable<any>;
  apiUrl: string;
  control = new FormControl();
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') api,
    private cd: ChangeDetectorRef,
    private dialogRef: MatDialogRef<SelectorProductoComponent, Producto>
  ) {
    this.apiUrl = `${api}/productos/disponibles`;
  }

  ngOnInit() {
    this.filteredProducts$ = this.control.valueChanges.pipe(
      // startWith('caple'),
      debounceTime(400),
      distinctUntilChanged(),
      tap(term => localStorage.setItem('sx.altp.term', term)),
      switchMap(value => this.lookUp(value))
    );
  }

  ngAfterViewInit() {
    const term = localStorage.getItem('sx.altp.term');
    if (term) {
      this.control.setValue(term);
      this.cd.detectChanges();
    }
  }

  lookUp(value: string) {
    const params = new HttpParams().set('term', value).set('activos', 'true');
    return this.http
      .get(this.apiUrl, {
        params: params
      })
      .pipe(catchError((response: any) => throwError(response)));
  }

  onSelection(event: Producto) {
    this.dialogRef.close(event);
  }
}
