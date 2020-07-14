import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Pedido, Periodo } from '@swrx/core-model';
import { PedidoService } from '../../services/pedido.service';
import { AltPedidoComponent } from '../../alt-pedido/alt-pedido.component';

@Component({
  selector: 'swrx-pedidos-facturados',
  templateUrl: './facturados.component.html',
  styleUrls: ['./facturados.component.scss']
})
export class FacturadosComponent implements OnInit {
  pedidos: Pedido[] = [];
  periodo: Periodo;
  STORAGE_KEY = 'sx-callcenter.pedidos.facturados.periodo';

  constructor(
    private service: PedidoService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.periodo = Periodo.fromStorage(this.STORAGE_KEY, Periodo.fromNow(60));
    this.reload();
  }

  reload() {
    this.service
      .findPeddosFacturados(this.periodo)
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
    console.log('Mostrando Pedido facturado: ', pedido);
    // this.dialog
    //   .open(AltPedidoComponent, { data: { pedido }, width: '90%' })
    //   .afterClosed()
    //   .subscribe(res => {
    //     if (res) {
    //       this.onSelection(pedido);
    //     }
    //   });
  }

  mostrarFactura() {
    // const ref = this.storage.ref('cfdis/TAFACCON-83707.pdf');
    // console.log('Ref: ', ref);
    // ref.getMetadata().subscribe(meta => console.log('Metadata: ', meta));
    /*
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
    */
  }
}
