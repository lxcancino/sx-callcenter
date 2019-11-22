import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaModule } from '@swrx/fa';
import { AgGridModule } from 'ag-grid-angular';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY MMMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM'
  }
};

import {
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatListModule,
  MatMenuModule,
  MatInputModule,
  MatCardModule,
  MatTabsModule,
  MatDialogModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatBadgeModule,
  MatButtonToggleModule,
  MatSelectModule,
  MatAutocompleteModule
} from '@angular/material';

import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';

import * as moment from 'moment';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // FontAwesomeModule,
    FaModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMomentDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    AgGridModule.withComponents([])
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    // FontAwesomeModule,
    FaModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMomentDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    AgGridModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {} },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class UiCoreModule {
  constructor() {
    moment.locale(['es-MX']);
  }
}
