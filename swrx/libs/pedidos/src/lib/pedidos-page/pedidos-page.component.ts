import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { PedidosFacade } from '../+state/pedidos.facade';
import { Pedido } from '@swrx/core-model';

import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AltPedidoComponent } from '../alt-pedido/alt-pedido.component';

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
    private dialog: MatDialog
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
}
