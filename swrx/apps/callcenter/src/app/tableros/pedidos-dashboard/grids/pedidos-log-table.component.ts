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
import * as moment from 'moment';
import { timer } from 'rxjs';

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
      .danger-cell {
        background-color: red;
        color: white;
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
    // params.api.sizeColumnsToFit();
    this.updateView();
  }

  private buildColsDef(): ColGroupDef[] {
    return [
      {
        headerName: 'Pedido',
        children: [
          {
            headerName: 'Cliente',
            field: 'nombre',
            width: 200,
            pinned: 'left'
          },
          {
            headerName: 'Pedido',
            field: 'folio',
            width: 100,
            pinned: 'left'
          },
          {
            headerName: 'Status',
            field: 'status',
            width: 120,
            pinned: 'left'
          },
          {
            headerName: 'Modificado',
            field: 'lastUpdated',
            width: 120,
            pinned: 'left',
            valueFormatter: params =>
              this.transformDate(params.value, 'dd/MM/yy HH:mm')
          },
          {
            headerName: 'Vendedor',
            field: 'createUser',
            width: 120,
            pinned: 'left'
          },
          {
            headerName: 'Cerrado por:',
            field: 'cerradoUser',
            width: 120,
            pinned: 'left'
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
            headerName: 'Atendido',
            field: 'atendido',
            width: 120,
            valueFormatter: params =>
              this.transformDate(params.value, 'dd-MMM (HH:mm)')
          },
          {
            headerName: 'Retraso',
            colId: 'retrasoAtencion',
            field: 'atendido',
            width: 110,
            filter: 'agNumberColumnFilter',
            valueGetter: params => {
              const pedidoLog = params.data;
              const atendido = pedidoLog.atendido;
              if (!atendido) {
                return this.minutesFromNow(params.data.lastUpdated);
              } else {
                const t_cerrado = pedidoLog.lastUpdated;
                const t_atendido = atendido;
                let ret = (t_atendido - t_cerrado) / (1000 * 60);
                if (ret < 0) {
                  ret = 0;
                }
                return Math.round(ret);
                // return this.minutesFromNow(params.data.lastUpdated);
              }
            },
            cellStyle: params => {
              if (params.data.atendido) {
                return null;
              }
              const atraso = params.value;
              if (atraso > 5 && atraso <= 10) {
                return { backgroundColor: 'rgb(255, 230, 0)', color: 'black' };
              } else if (atraso > 10) {
                return { backgroundColor: '#c24949f6', color: '#fff' };
              } else {
                return null;
              }
            }
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
                return params.data.facturacion.folio;
              } else {
                return null;
              }
            }
          },
          {
            headerName: 'Fecha',
            colId: 'facturacionHora',
            width: 120,
            valueGetter: params => {
              if (params.data.facturacion) {
                return params.data.facturacion.creado;
              } else {
                return null;
              }
            },
            valueFormatter: params =>
              this.transformDate(params.value, 'dd-MMM (HH:mm)')
          },
          {
            headerName: 'Retraso',
            colId: 'retrasoFacturacion',
            field: 'facturacion',
            width: 100,
            filter: 'agNumberColumnFilter',
            valueGetter: params => {
              const facturacion = params.data.facturacion;
              if (facturacion && facturacion.folio) {
                return 0;
              } else {
                return this.minutesFromNow(params.data.lastUpdated);
              }
            },
            cellStyle: params => {
              const atraso = params.value;
              if (atraso > 15 && atraso <= 30) {
                return { backgroundColor: 'rgb(255, 230, 0)', color: 'black' };
              } else if (atraso > 30) {
                return { backgroundColor: '#c24949f6', color: '#fff' };
              } else {
                return null;
              }
            }
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
            width: 110,
            columnGroupShow: 'closed',
            filter: false,
            valueGetter: params =>
              params.data.embarqueLog ? params.data.embarqueLog.asignado : '',
            valueFormatter: params => this.transformDate(params.value, 'HH:mm')
          },
          {
            headerName: 'Salida',
            colId: 'embarqueSalida',
            width: 120,
            columnGroupShow: 'open',
            filter: false,
            valueGetter: params =>
              params.data.embarqueLog ? params.data.embarqueLog.salida : '',
            valueFormatter: params =>
              this.transformDate(params.value, 'dd-MMM (HH:mm)')
          },
          {
            headerName: 'Entrega',
            colId: 'embarqueEntrega',
            columnGroupShow: 'open',
            filter: false,
            width: 120,
            valueGetter: params => {
              const embarque = params.data.embarqueLog;
              if (embarque && embarque.recepcion) {
                return embarque.recepcion.arribo.toDate();
              } else {
                return null;
              }
            },
            valueFormatter: params =>
              this.transformDate(params.value, 'dd-MMM (HH:mm)')
          },
          {
            headerName: 'Ret Entrega',
            colId: 'retrasoEntrega',
            field: 'embarqueLog',
            columnGroupShow: 'open',
            width: 110,
            filter: 'agNumberColumnFilter',
            valueGetter: params => {
              const embarque = params.data.embarqueLog;
              if (embarque) {
                return 0;
              } else {
                return this.hoursFromNow(params.data.lastUpdated);
              }
            },
            cellStyle: params => {
              const atraso = params.value;
              if (atraso > 4 && atraso < 10) {
                return { backgroundColor: 'rgb(255, 230, 0)', color: 'black' };
              } else if (atraso > 10) {
                return { backgroundColor: '#c24949f6', color: '#fff' };
              } else {
                return null;
              }
            }
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
  }

  fromNow(time: any) {
    return moment(time).fromNow(false);
  }

  minutesFromNow(time: any): number {
    const a = moment();
    const b = moment(time);
    const diff = a.diff(b, 'minutes');
    return diff;
  }
  hoursFromNow(time: any): number {
    const a = moment();
    const b = moment(time);
    const diff = a.diff(b, 'hours');
    return diff;
  }

  updateView() {
    timer(100, 60000).subscribe(() => {
      this.gridApi.redrawRows();
    });
  }
}
