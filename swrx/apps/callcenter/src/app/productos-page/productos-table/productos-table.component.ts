import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  Inject,
  LOCALE_ID
} from '@angular/core';

import {
  GridOptions,
  GridApi,
  ColDef,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ColumnApi
} from 'ag-grid-community';
import { formatCurrency, formatDate } from '@angular/common';

import { spAgGridText } from '@swrx/ui-core';
import { Producto } from '@swrx/core-model';

@Component({
  selector: 'swrx-productos-table',
  templateUrl: './productos-table.component.html',
  styleUrls: ['./productos-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosTableComponent implements OnInit {
  @Input() partidas: Producto[] = [];
  @Output() edit = new EventEmitter();

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
    this.gridOptions.onCellMouseOver = event => {};
    this.gridOptions.onCellDoubleClicked = event => {};
  }

  onDoubleClick(event: RowDoubleClickedEvent) {
    this.edit.emit(event.data);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params) {
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
        headerName: 'Producto',
        field: 'clave',
        width: 140,
        pinned: 'left'
      },
      {
        headerName: 'Descripcion',
        field: 'descripcion',
        width: 250,
        pinned: 'left'
      },
      {
        headerName: 'Linea',
        field: 'linea'
      },
      {
        headerName: 'Marca',
        field: 'marca'
      },
      {
        headerName: 'Clase',
        field: 'clase'
      },
      {
        headerName: 'P. Contado',
        field: 'precioContado',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'P. Crédito',
        field: 'precioCredito',
        valueFormatter: params => this.transformCurrency(params.value)
      }
    ];
  }
  transformCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }
}
