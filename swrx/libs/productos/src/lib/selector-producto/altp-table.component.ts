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
  selector: 'swrx-altp-table',
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
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AltpTableComponent implements OnInit {
  @Input() partidas: Producto[] = [];
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
        width: 200,
        pinned: 'left'
      },
      {
        headerName: 'A',
        field: 'ancho'
      },
      {
        headerName: 'L',
        field: 'largo'
      },
      {
        headerName: 'g',
        field: 'gramos'
      },
      {
        headerName: 'Cal',
        field: 'calibre'
      },
      {
        headerName: 'Color',
        field: 'color'
      },
      {
        headerName: 'N',
        field: 'nacional',
        width: 40,
        sortable: false,
        filter: false,
        valueFormatter: params => (params.value ? 'N' : 'I')
      },
      {
        headerName: 'P',
        field: 'presentacion',
        width: 40,
        sortable: false,
        filter: false,
        valueFormatter: params => params.value.substr(0, 1)
      },
      {
        headerName: 'Linea',
        field: 'linea',
        width: 120
      },
      {
        headerName: 'Marca',
        field: 'marca',
        width: 120
      },
      {
        headerName: 'Clase',
        field: 'clase',
        width: 120
      },
      {
        headerName: 'P. Contado',
        field: 'precioContado',
        width: 120,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'P. Crédito',
        field: 'precioCredito',
        width: 120,
        valueFormatter: params => this.transformCurrency(params.value)
      }
    ];
  }
  transformCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }
}
