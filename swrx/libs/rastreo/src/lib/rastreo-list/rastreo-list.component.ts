import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter,Inject, LOCALE_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { formatCurrency, formatDate } from '@angular/common';

import {
  GridOptions,
  GridApi,
  ColDef,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ColumnApi
} from 'ag-grid-community';

import { spAgGridText } from '@swrx/ui-core';

@Component({
  selector: 'swrx-rastreo-list',
  templateUrl: './rastreo-list.component.html',
  styleUrls: ['./rastreo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RastreoListComponent implements OnInit {

  @Input() pedidos;
  @Output() pedidoSelect = new EventEmitter;

  gridOptions: GridOptions;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  defaultColDef: any;
  localeText = spAgGridText;

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnInit() {
    this.buildGridOptions();
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 150,
      sortable: true,
      resizable: true
    };
    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);
    this.gridOptions.onCellMouseOver = event => {};
    this.gridOptions.onCellDoubleClicked = event => {};
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    if (params.data.estado === 'RECHAZADO') {
      return {
        'font-weight': 'bold',
        'font-style': 'italic',
        color: 'red',
        cursor: 'pointer'
      };
    }
    if (params.data.estado === 'AUTORIZADO') {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'green' };
    }
    return {};
  }

  onDoubleClick(event: RowDoubleClickedEvent) {
    console.log('Emitiendo por DblClick');
    this.pedidoSelect.emit(event.data);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params) {
    // this.autoSizeAll();
    params.api.sizeColumnsToFit();
  }

  autoSizeAll() {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.getColId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Folio',
        field: 'folio',
        width: 40,
        pinned: 'left'
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        pinned: 'left',
        width: 250
      },
    ];
  }

  transformCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }
  transformDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
  }

}
