import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { PedidosFacade } from '../+state/pedidos.facade';
import { Pedido } from '@swrx/core-model';

import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AltPedidoComponent } from '../alt-pedido/alt-pedido.component';

import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loading$ = this.facade.loading$;
    this.pedidos$ = this.facade.allPedidos$;
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

  mostrarFactura() {
    const ref = this.storage.ref('cfdis/TAFACCON-83707.pdf');

    ref.getDownloadURL().subscribe(url => {
      if (url) {
        const headers = new HttpHeaders().set(
          'Content-type',
          'application/pdf'
        );
        this.http.get(url, { headers, responseType: 'blob' }).subscribe(
          res => {
            const blob = new Blob([res], {
              type: 'application/pdf'
            });
            const fileUrl = window.URL.createObjectURL(blob);
            window.open(fileUrl, '_blank');
          },
          error => console.error(error)
        );
      }
    });
  }
}
