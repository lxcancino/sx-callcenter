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
import { CartItem } from '../+state/cart.models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'swrx-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemsComponent implements OnInit {
  @Input() cartForm: FormGroup;
  @Input() partidas: CartItem[] = [];
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
        headerName: 'Producto',
        field: 'clave',
        pinned: 'left',
        maxWidth: 150,
        resizable: true
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 200
      },
      {
        headerName: 'Can',
        field: 'cantidad',
        width: 110
      },
      {
        headerName: 'P. Credito',
        field: 'precioCrédito',
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Importe',
        field: 'importe',
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Sub Tot',
        field: 'subtotal',
        width: 110,
        cellRenderer: params => this.transformCurrency(params.value)
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
