import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { PedidosFacade } from '../+state/pedidos.facade';
import { Pedido } from '@swrx/core-model';

import { Observable } from 'rxjs';

@Component({
  selector: 'swrx-pedidos-page',
  templateUrl: './pedidos-page.component.html',
  styleUrls: ['./pedidos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosPageComponent implements OnInit {
  pedidos$: Observable<Pedido[]>;

  constructor(private facade: PedidosFacade, private router: Router) {}

  ngOnInit() {
    this.pedidos$ = this.facade.allPedidos$;
  }

  onSelection(event: Pedido) {
    console.log('Edit: ', event);
    this.router.navigate(['/shop/cart', event.id]);
  }
}
