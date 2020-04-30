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
import { Deposito } from '../+state/depositos.models';

@Component({
  selector: 'swrx-depositos-table',
  templateUrl: './depositos-table.component.html',
  styleUrls: ['./depositos-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositosTableComponent implements OnInit {
  @Input() partidas: Deposito[] = [];
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
    this.edit.emit(event.data);
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
        headerName: 'Id',
        field: 'folio',
        width: 80,
        pinned: 'left'
      },
      {
        headerName: 'Ped',
        field: 'pedido',
        width: 90,
        pinned: 'left',
        valueGetter: params =>
          params.data.pedido ? params.data.pedido.folio : ''
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        pinned: 'left',
        valueFormatter: params => this.transformDate(params.value)
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 110,
        pinned: 'left'
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        pinned: 'left',
        width: 270
      },

      {
        headerName: 'Total',
        field: 'total',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'F Depósito',
        field: 'fechaDeposito',
        width: 110,
        valueFormatter: params => this.transformDate(params.value)
      },

      {
        headerName: 'Vendedor',
        field: 'updateUser',
        width: 100
      },
      {
        headerName: 'Estatus',
        field: 'estado',
        width: 110
      },
      {
        headerName: 'Cerrado',
        field: 'cerrado',
        width: 100,
        valueFormatter: params => (params.value ? 'SI' : 'NO')
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        width: 150
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
