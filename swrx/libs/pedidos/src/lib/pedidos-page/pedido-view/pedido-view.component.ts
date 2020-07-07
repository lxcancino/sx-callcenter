import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from '@swrx/core-model';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ReportService } from '@swrx/reports';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'swrx-pedido-view',
  templateUrl: './pedido-view.component.html',
  styleUrls: ['./pedido-view.component.scss']
})
export class PedidoViewComponent implements OnInit {
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
    private http: HttpClient
  ) {}

  ngOnInit() {
    // this.route.paramMap.subscribe(params => console.log(params.get('id')));
    this.pedido$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.service.get(id)),
      tap(p => console.log('Pedido: ', p.partidas)),
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
      catchError(err => {
        console.log('Error :', err.message);
        return 'notFound';
      })
    );
  }

  print(pedido: Pedido) {
    this.reportService.runReport(`pedidos/print/${pedido.id}`, {});
  }
}
