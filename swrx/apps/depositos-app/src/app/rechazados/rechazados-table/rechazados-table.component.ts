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
import { Deposito } from '@swrx/depositos';

@Component({
  selector: 'swrx-rechazados-table',
  templateUrl: './rechazados-table.component.html',
  styleUrls: ['./rechazados-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RechazadosTableComponent implements OnInit {
  @Input() partidas: Deposito[] = [];
  @Output() doubleClick = new EventEmitter();

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
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onDoubleClick(event: RowDoubleClickedEvent) {
    this.doubleClick.emit(event.data);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params) {
    this.autoSizeAll();
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
        headerName: 'Sucursal',
        field: 'sucursal',
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Nombre',
        field: 'nombre'
      },
      {
        headerName: 'Origen',
        field: 'banco',
        valueGetter: params => params.data.banco.nombreCorto
      },
      {
        headerName: 'Destino',
        field: 'cuenta',
        valueGetter: params => params.data.cuenta.descripcion
      },
      {
        headerName: 'F. Depósito',
        field: 'fechaDeposito',
        width: 100,
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Rechazo F.',
        field: 'rechazoFecha',
        width: 110,
        valueGetter: params => {
          const d: Deposito = params.data;
          if (d.rechazo) {
            return d.rechazo.fecha;
          } else {
            return null;
          }
        },
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Motivo',
        field: 'motivo',
        valueGetter: params => {
          const d: Deposito = params.data;
          if (d.rechazo) {
            return d.rechazo.motivo;
          } else {
            return '';
          }
        }
      },
      {
        headerName: 'Vendedor',
        field: 'vendedor'
      }
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
