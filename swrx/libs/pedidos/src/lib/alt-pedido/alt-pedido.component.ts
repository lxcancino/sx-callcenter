import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  LOCALE_ID,
  ChangeDetectorRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { formatCurrency, formatDate, formatNumber } from '@angular/common';
import {
  GridOptions,
  ColDef,
  GridReadyEvent,
  GridApi,
  ColumnApi
} from 'ag-grid-community';
import { spAgGridText } from '@swrx/ui-core';
import { Pedido, PedidoDet } from '@swrx/core-model';

@Component({
  selector: 'swrx-alt-pedido',
  templateUrl: './alt-pedido.component.html',
  styleUrls: ['./alt-pedido.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AltPedidoComponent implements OnInit {
  pedido: Pedido;
  partidas: PedidoDet[];
  gridOptions: GridOptions;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  localeText = spAgGridText;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    @Inject(LOCALE_ID) private locale: string,
    private dialogRef: MatDialogRef<AltPedidoComponent>,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.pedido = this.data.pedido;
    this.partidas = this.pedido.partidas;
    this.buildGridOptions();
    console.log('AltView: ', this.pedido);
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onGridReady(params: GridReadyEvent) {
    console.log('On grid ready');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.cd.markForCheck();
  }

  onFirstDataRendered(params) {
    console.log('On first data rendered');
    params.api.sizeColumnsToFit();
    // this.gridApi.sizeColumnsToFit();
  }

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Producto',
        field: 'clave',
        width: 150,
        resizable: true,
        pinned: 'left'
      },
      {
        headerName: 'Descripcion',
        field: 'descripcion',
        minWidth: 300,
        resizable: true,
        pinned: 'left'
      },
      {
        headerName: 'U',
        field: 'unidad',
        width: 90
      },
      {
        headerName: 'Cantidad',
        field: 'cantidad',
        valueFormatter: params =>
          formatNumber(params.value, this.locale, '1.0-0')
      },
      {
        headerName: 'Precio',
        field: 'precio',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Desc',
        field: 'descuentoImporte',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Sub',
        field: 'subtotal',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Iva',
        field: 'impuesto',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Total',
        field: 'total',
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        resizable: true
      },
      {
        headerName: 'Corte',
        field: 'corte',
        valueGetter: params =>
          params.data.corte ? params.data.corte.instruccion : ''
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
