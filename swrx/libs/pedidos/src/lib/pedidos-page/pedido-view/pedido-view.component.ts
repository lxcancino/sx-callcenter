import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Pedido } from '@swrx/core-model';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { map, switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ReportService } from '@swrx/reports';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { EnvioMailComponent } from '@swrx/ui-core';

@Component({
  selector: 'swrx-pedido-view',
  templateUrl: './pedido-view.component.html',
  styleUrls: ['./pedido-view.component.scss']
})
export class PedidoViewComponent implements OnInit, OnDestroy {
  pedido: Pedido;
  pedido$: Observable<Pedido>;
  pdf$: Observable<string>;
  xml$: Observable<string>;

  destroy$ = new Subject<boolean>();
  displayedColumns: string[] = [
    'row',
    'clave',
    'descripcion',
    'cantidad',
    'precio',
    'importeBruto',
    'descuento',
    'subtotal',
    'impuesto',
    'total'
  ];
  totalColumns: string[] = ['row', 'total'];

  constructor(
    private route: ActivatedRoute,
    private service: PedidoService,
    private storage: AngularFireStorage,
    private reportService: ReportService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.pedido$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.service.get(id)),
      takeUntil(this.destroy$)
    );

    this.pdf$ = this.pedido$.pipe(
      switchMap(pedido => {
        const { facturaSerie, facturaFolio } = pedido;
        const ref = this.storage.ref(
          `cfdis/${facturaSerie}-${facturaFolio}.pdf`
        );
        return ref.getDownloadURL();
      }),
      takeUntil(this.destroy$),
      catchError(err => {
        console.log('PDF Error :', err.message);
        return 'notFound';
      })
    );

    this.xml$ = this.pedido$.pipe(
      switchMap(pedido => {
        const { facturaSerie, facturaFolio } = pedido;
        const ref = this.storage.ref(
          `cfdis/${facturaSerie}-${facturaFolio}.xml`
        );
        return ref.getDownloadURL();
      }),
      takeUntil(this.destroy$),
      catchError(err => {
        console.log('XML Error :', err.message);
        return 'notFound';
      })
    );
  }

  ngOnDestroy() {}

  print(pedido: Pedido) {
    this.reportService.runReport(`pedidos/print/${pedido.id}`, {});
  }

  enviarPorCorreo(pdfUrl: string, xmlUrl: string, ped: Partial<Pedido>) {
    this.dialog
      .open(EnvioMailComponent, {
        data: { email: ped.cliente.cfdiMail },
        width: '400px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.doEnviarPorCorreo(pdfUrl, xmlUrl, res, ped);
        }
      });
  }

  doEnviarPorCorreo(
    pdfUrl: string,
    xmlUrl: string,
    target: string,
    ped: Partial<Pedido>
  ) {
    this.service.enviarFactura(pdfUrl, xmlUrl, target, ped).subscribe(
      res => {
        alert('Correo enviado satisfactoriamente');
      },
      error => {
        console.error('Error enviando mail: ', error);
      }
    );
  }
}
