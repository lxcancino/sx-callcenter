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
  ColumnApi,
  ColGroupDef
} from 'ag-grid-community';
import { formatCurrency, formatDate } from '@angular/common';

import { spAgGridText } from '@swrx/ui-core';
import { Producto } from '@swrx/core-model';

@Component({
  selector: 'swrx-pedidos-log-table',
  template: `
    <div class="panel">
      <ag-grid-angular
        #agGrid
        class="ag-theme-balham panel"
        [rowData]="partidas"
        [gridOptions]="gridOptions"
        [defaultColDef]="defaultColDef"
        [floatingFilter]="true"
        [localeText]="localeText"
        (gridReady)="onGridReady($event)"
        (rowDoubleClicked)="onDoubleClick($event)"
        (firstDataRendered)="onFirstDataRendered($event)"
        rowSelection="single"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .panel {
        height: 65vh;
        width: 100%;
      }
      .facturacion-header {
        font-style: bold;
        background-color: #5b9bd5;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosLogComponent implements OnInit {
  private _partidas: Producto[] = [];
  @Output() selected = new EventEmitter();

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
      width: 80,
      sortable: true,
      resizable: true
    };
    this.gridOptions.onCellMouseOver = event => {};
    this.gridOptions.onCellDoubleClicked = event => {};
  }

  onDoubleClick(event: RowDoubleClickedEvent) {
    this.selected.emit(event.data);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  private buildColsDef(): ColGroupDef[] {
    return [
      {
        headerName: 'Pedido',
        children: [
          {
            headerName: 'Cliente',
            field: 'nombre',
            maxWidth: 200
          },
          {
            headerName: 'Pedido',
            field: 'folio',
            width: 100,
            maxWidth: 100
          },
          {
            headerName: 'Status',
            field: 'status',
            width: 120
          },
          {
            headerName: 'Modificado',
            field: 'lastUpdated',
            valueFormatter: params =>
              this.transformDate(params.value, 'dd/MM/yy HH:mm')
          },
          {
            headerName: 'Vendedor',
            field: 'createUser',
            width: 120
          }
        ]
      },

      {
        headerName: 'Atención en Sucursal',
        children: [
          {
            headerName: 'Sucursal',
            field: 'sucursal',
            width: 120
          },
          {
            headerName: 'Atiende',
            field: 'atiende',
            width: 110
          },
          {
            headerName: 'Hora',
            field: 'atendido',
            minWidth: 100,
            maxWidth: 100,
            valueFormatter: params => this.transformDate(params.value, 'HH:mm')
          }
        ]
      },
      {
        headerName: 'Facturación',
        headerClass: 'facturacion-header',
        children: [
          {
            headerName: 'Folio',
            field: 'facturacion',
            width: 110,
            valueGetter: params => {
              if (params.data.facturacion) {
                return params.data.folio;
              } else {
                return null;
              }
            }
          },
          {
            headerName: 'Hora',
            colId: 'facturacionHora',
            width: 100,
            valueGetter: params => {
              if (params.data.facturacion) {
                return params.data.facturacion.creado;
              } else {
                return null;
              }
            },
            valueFormatter: params => this.transformDate(params.value, 'HH:mm')
          }
        ]
      },
      {
        headerName: 'Embarque',
        openByDefault: true,
        children: [
          {
            headerName: '#',
            colId: 'embarqueFolio',
            filter: false,
            valueGetter: params =>
              params.data.embarqueLog ? params.data.embarqueLog.embarque : ''
          },
          {
            headerName: 'Chofer',
            colId: 'embarqueChofer',
            width: 200,
            columnGroupShow: 'closed',
            valueGetter: params =>
              params.data.embarqueLog ? params.data.embarqueLog.chofer : '',
            filter: false
          },
          {
            headerName: 'Asignación',
            colId: 'embarqueAsignado',
            columnGroupShow: 'closed',
            filter: false,
            valueGetter: params =>
              params.data.embarqueLog ? params.data.embarqueLog.asignado : '',
            valueFormatter: params => this.transformDate(params.value, 'HH:mm')
          },
          {
            headerName: 'Salida',
            colId: 'embarqueSalida',
            columnGroupShow: 'open',
            filter: false,
            valueGetter: params =>
              params.data.embarqueLog ? params.data.embarqueLog.salida : '',
            valueFormatter: params => this.transformDate(params.value, 'HH:mm')
          },
          {
            headerName: 'Entrega',
            colId: 'embarqueEntrega',
            columnGroupShow: 'open',
            filter: false,
            valueGetter: params =>
              params.data.embarqueLog ? params.data.embarqueLog.recepcion : '',
            valueFormatter: params => this.transformDate(params.value, 'HH:mm')
          }
        ]
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

  @Input()
  get partidas() {
    return this._partidas;
  }

  set partidas(value: any[]) {
    this._partidas = value;
    console.log('Asignando partidas: ', value);
  }
}
