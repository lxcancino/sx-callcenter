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

import { spAgGridText } from '@swrx/ui-core';
import { Transporte } from '../transporte';

@Component({
  selector: 'swrx-transportes-table',
  templateUrl: './transportes-table.component.html',
  styleUrls: ['./transportes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportesTableComponent implements OnInit {
  @Input() partidas: Transporte[] = [];
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
        headerName: 'Nombre',
        field: 'nombre',
        minWidth: 200
      },
      {
        headerName: 'Calle',
        colId: 'calle',
        valueGetter: params => params.data.direccion.calle
      },
      {
        headerName: 'No Interior',
        colId: 'numeroInterior',
        valueGetter: params => params.data.direccion.numeroInterior
      },
      {
        headerName: 'No Exterior',
        colId: 'numeroExterior',
        valueGetter: params => params.data.direccion.numeroExterior
      },
      {
        headerName: 'Colonia',
        colId: 'colonia',
        valueGetter: params => params.data.direccion.colonia
      },
      {
        headerName: 'Municipio',
        colId: 'municipio',
        valueGetter: params => params.data.direccion.municipio
      },
      {
        headerName: 'Estado',
        colId: 'estado',
        valueGetter: params => params.data.direccion.estado
      }
    ];
  }

  
}
