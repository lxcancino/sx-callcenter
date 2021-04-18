import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  LOCALE_ID
} from '@angular/core';
import { Router } from '@angular/router';

import { PedidosFacade } from '../+state/pedidos.facade';
import { Pedido } from '@swrx/core-model';

import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AltPedidoComponent } from '../alt-pedido/alt-pedido.component';

import { ColDef, GridOptions } from 'ag-grid-community';
import { formatCurrency, formatDate } from '@angular/common';

@Component({
  selector: 'swrx-pedidos-page',
  templateUrl: './pedidos-page.component.html',
  styleUrls: ['./pedidos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosPageComponent implements OnInit {
  pedidos$: Observable<Pedido[]>;
  loading = true;
  loading$: Observable<boolean>;

  constructor(
    private facade: PedidosFacade,
    private router: Router,
    private dialog: MatDialog,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit() {
    this.loading$ = this.facade.loading$;
    this.pedidos$ = this.facade.allPedidos$;
    this.reload();
  }

  reload() {
    this.facade.loadAll();
  }

  onSelection(event: Pedido) {
    this.router.navigate(['/shop/cart', event.id]);
  }

  onView(pedido: Pedido) {
    this.dialog
      .open(AltPedidoComponent, { data: { pedido }, width: '90%' })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.onSelection(pedido);
        }
      });
  }

  cambiarPeriodo() {
    console.log('Cambiar periodo');
  }

  onPrint(event: Partial<Pedido>) {
    this.facade.imprimirPedido(event);
  }
  gridOptions = this.buildGridOptions();

  buildGridOptions() {
    // this.gridOptions = <GridOptions>{};
    // this.gridOptions.columnDefs = this.buildColsDef();
    return {
      columnDefs: this.buildColsDef()
    };
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
