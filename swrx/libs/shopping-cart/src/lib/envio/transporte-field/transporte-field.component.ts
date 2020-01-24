import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  Inject
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Transporte } from '@swrx/core-model';

const TransporteValidator: ValidatorFn = (control: AbstractControl) => {
  const fg = control.parent;
  const tipo = fg.get('tipo').value;
  if (tipo && tipo === 'FORANEO') {
    const value = control.value;
    return value ? null : { transporteRequerido: true };
  }
  return null;
};

@Component({
  selector: 'swrx-transporte-field',
  template: `
    <mat-form-field class="field" [formGroup]="parent" appearance="fill">
      <mat-label>Transporte</mat-label>
      <mat-select
        placeholder="Transporte"
        formControlName="transporte"
        [compareWith]="compareWith"
      >
        <mat-option *ngFor="let s of transportes" [value]="s">
          {{ s.nombre }}
        </mat-option>
      </mat-select>
      <mat-error *ngIf="transporte.invalid"
        >Debe seleccionar un transporte foraneo</mat-error
      >
    </mat-form-field>
  `,
  styles: [
    `
      .field {
        width: 100%;
      }
    `
  ]
})
export class TransporteFieldComponent implements OnInit, OnDestroy {
  @Input() parent: FormGroup;
  transportes: Transporte[];
  destroy$ = new Subject<boolean>();
  apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/transportes`;
  }

  ngOnInit() {
    this.parent.get('transporte').setValidators(TransporteValidator);
    this.http
      .get<Transporte[]>(this.apiUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => (this.transportes = res),
        response => console.log('HttpError: ', response)
      );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  get transporte(): AbstractControl {
    return this.parent.get('transporte');
  }
  compareWith(itemA, itemB: any) {
    if (itemA && itemB) {
      return itemA.id === itemB.id;
    } else {
      return false;
    }
  }
}
