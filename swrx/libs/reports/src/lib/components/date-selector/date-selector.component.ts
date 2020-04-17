import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as moment from 'moment';

@Component({
  selector: 'swrx-date-selector',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>
      <mat-form-field>
        <input
          matInput
          [matDatepicker]="myDatepicker"
          placeholder="Fecha"
          [(ngModel)]="fecha"
        />
        <mat-datepicker-toggle
          matSuffix
          [for]="myDatepicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Canelar</button>
      <button mat-button (click)="submit()">Aceptar</button>
    </mat-dialog-actions>
  `
})
export class DateSelectorComponent implements OnInit {
  fecha = new Date();

  title = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DateSelectorComponent>
  ) {
    this.title = data.title || 'Seleccione una fecha';
    this.fecha = data.fecha || new Date();
  }

  ngOnInit() {}

  submit() {
    const ff = moment(this.fecha);
    this.dialogRef.close(ff.toISOString());
  }
}
