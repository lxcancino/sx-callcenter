import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Pedido, Periodo } from '@swrx/core-model';
import { PedidoService } from '../../services/pedido.service';
import { AltPedidoComponent } from '../../alt-pedido/alt-pedido.component';

@Component({
  selector: 'swrx-pedidos-cerrados',
  templateUrl: './cerrados.component.html',
  styleUrls: ['./cerrados.component.scss']
})
export class CerradosComponent implements OnInit {
  pedidos: Pedido[] = [];
  periodo: Periodo;
  STORAGE_KEY = 'sx-callcenter.pedidos.cerrados.periodo';

  constructor(
    private service: PedidoService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('Init component...');
    this.periodo = Periodo.fromStorage(this.STORAGE_KEY, Periodo.fromNow(45));
  }

  reload() {
    this.service
      .findPeddosCerrados(this.periodo)
      .pipe(tap(data => console.log('Pedidos: ', data)))
      .subscribe(
        res => {
          this.pedidos = res;
          this.cd.markForCheck();
        },
        err => console.error('Error buscando pedidos cerrados: ', err)
      );
  }

  changePeriodo() {
    console.log('Cambiar periodo......');
  }

  onSelection(event: Pedido) {
    this.router.navigate(['pedidos', 'view', event.id]);
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
}
