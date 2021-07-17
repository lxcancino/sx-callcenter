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
import { Pedido } from '@swrx/core-model';

@Component({
  selector: 'swrx-pedidos-table',
  templateUrl: './pedidos-table.component.html',
  styleUrls: ['./pedidos-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosTableComponent implements OnInit {
  @Input() partidas: Pedido[] = [];
  @Output() selection = new EventEmitter();
  @Output() quickView = new EventEmitter<Pedido>();
  @Output() print = new EventEmitter();

  localeText = spAgGridText;
  gridOptions: GridOptions;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  defaultColDef: any;

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
    this.gridOptions.onCellMouseOver = event => {
      if (event.colDef.field === 'folio') {
      }
    };
    this.gridOptions.onCellDoubleClicked = event => {
      if (event.colDef.field === 'folio') {
        this.quickView.emit(event.data);
      } else if (event.colDef.colId === 'print') {
        this.print.emit(event.data);
      } else {
        this.selection.emit(event.data);
      }
    };
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    if (params.data.status === 'CERRADO') {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'green' };
    }
    if (params.data.autorizacionesRequeridas) {
      if (params.data.autorizacion) {
        return {
          'font-weight': 'bold',
          'font-style': 'italic',
          color: 'rgb(25, 88, 131)'
        };
      } else {
        return {
          'font-weight': 'bold',
          'font-style': 'italic',
          color: 'rgb(190, 119, 26)'
        };
      }
    }

    return {};
  }

  onDoubleClick(event: RowDoubleClickedEvent) {}

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
        headerName: 'No',
        field: 'folio',
        width: 90,
        pinned: 'left'
      },
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
        field: 'nombre',
        width: 250
      },
      {
        headerName: 'Tipo',
        field: 'tipo',
        width: 100,
        valueGetter: params => params.data.tipo
      },
      {
        headerName: 'Envio',
        field: 'envio',
        width: 100,
        valueGetter: params => (params.data.envio ? 'ENVIO' : 'PASAN')
      },
      {
        headerName: 'F.Pago',
        field: 'formaDePago',
        valueGetter: params => params.data.formaDePago
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 130,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Estatus',
        field: 'status',
        width: 130,
        valueGetter: params => {
          if (params.data.autorizacionesRequeridas) {
            return `${params.data.status.substr(
              0,
              3
            )} (A${params.data.autorizacionesRequeridas.substr(0, 1)})`;
          } else {
            return params.data.status;
          }
        }
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        width: 200
      },
      {
        headerName: 'Modificado',
        field: 'lastUpdated',
        width: 150,
        valueFormatter: params =>
          this.transformDate(params.value, 'dd/MM/yyyy hh:mm')
      },
      {
        headerName: 'Creado Por:',
        field: 'vendedor',
        width: 150,
        valueGetter: params => params.data.createUser
      },
      {
        headerName: 'Modificado Por:',
        field: 'vendedor',
        width: 150,
        valueGetter: params => params.data.updateUser
      },
      {
        headerName: 'Imprimir',
        colId: 'print',
        width: 100,
        valueGetter: params => 'IMPRIMIR'
      }
    ];
  }

  transformDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
  }

  transformCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }
}
