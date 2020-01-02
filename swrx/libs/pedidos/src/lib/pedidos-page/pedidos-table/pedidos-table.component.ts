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
    this.gridOptions.onCellMouseOver = event => {
      if (event.colDef.field === 'folio') {
        // console.log('Mouse over: ', event);
      }
    };
    this.gridOptions.onCellDoubleClicked = event => {
      if (event.colDef.field === 'folio') {
        event.event.stopPropagation();
        console.log('Consulta rapida de pedido: ', event.data);
        event.event.stopImmediatePropagation();
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
    return {};
  }

  onDoubleClick(event: RowDoubleClickedEvent) {
    // console.log('DblClick: ', event);
    // this.selection.emit(event.data);
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
        valueGetter: params => params.data.tipo
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
        width: 130
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        width: 200
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
