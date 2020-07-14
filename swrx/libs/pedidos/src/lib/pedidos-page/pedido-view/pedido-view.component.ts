import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from '@swrx/core-model';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Observable, Subject, forkJoin } from 'rxjs';
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
      // tap(p => console.log('Pedido: ', p.partidas)),
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

    // const { facturaSerie, facturaFolio } = pedido;
    // const ref = this.storage.ref('cfdis/TAFACCON-83707.pdf');

    // ref.getDownloadURL().subscribe(url => {
    //   console.log('Url: ', url);
    //   if (url) {
    //     const headers = new HttpHeaders().set(
    //       'Content-type',
    //       'application/pdf'
    //     );
    //     this.http.get(url, { headers, responseType: 'blob' }).subscribe(
    //       res => {
    //         const blob = new Blob([res], {
    //           type: 'application/pdf'
    //         });
    //         const fileUrl = window.URL.createObjectURL(blob);
    //         window.open(fileUrl, '_blank');
    //       },
    //       error => console.error(error)
    //     );
    //   }
    // });
  }

  enviarPorCorreo(pdfUrl: string, xmlUrl: string) {
    console.log('PDF: ', pdfUrl);

    const pdfBlob$ = this.http.get(pdfUrl, { responseType: 'blob' }).pipe(
      map(
        res =>
          new Blob([res], {
            type: 'application/pdf'
          })
      )

      /*
      map(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        let base64data;
        reader.onloadend = function() {
          base64data = reader.result;
          console.log('BASE64', base64data);
          return reader.result;
        };
        return base64data;
      })
      */
    );

    const xmlBlob$ = this.http.get(pdfUrl, { responseType: 'blob' }).pipe(
      map(
        res =>
          new Blob([res], {
            type: 'text/xml'
          })
      )
    );

    // pdfBlob$.subscribe(res => console.log('MY: ', res));
    const both$ = forkJoin(pdfBlob$, xmlBlob$);
    both$.subscribe(([pdfBlob, xmlBlob]) => {
      console.log('PDF BLOB: ', pdfBlob);
      console.log('XML BLOB: ', xmlBlob);

      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      let base64data;
      reader.onloadend = function() {
        base64data = reader.result;
        console.log('PDF_BASE64', base64data);
      };
    });

    // const headers = new HttpHeaders().set(
    //   'Content-type',
    //   'application/pdf'
    // );
  }

  enviarPorCorreo2(pedido: Partial<Pedido>) {
    const { facturaSerie, facturaFolio } = pedido;
    console.log(facturaSerie, facturaFolio);
    const ref = this.storage.ref(`cfdis/${facturaSerie}-${facturaFolio}.pdf`);

    ref.getDownloadURL().subscribe(url => {
      console.log('URL: ', url);
      this.http.get(url, { responseType: 'blob' }).subscribe(
        res => {
          const headers = new HttpHeaders().set(
            'Content-type',
            'application/pdf'
          );
          const blob = new Blob([res], {
            type: 'application/pdf'
          });
          this.http.post('mailJetURL', blob, { headers });
          // const fileUrl = window.URL.createObjectURL(blob);
          // window.open(fileUrl, '_blank');
        },
        error => console.error(error)
      );
      /*
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        const blob = xhr.response;
        console.log('Blob: ', blob);
      };
      xhr.open('GET', url);
      xhr.send();
      */
    });
    // const ref = this.storage.ref('cfdis/TAFACCON-83707.pdf');
  }
}
