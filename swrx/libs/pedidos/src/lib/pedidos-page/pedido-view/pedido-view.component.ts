import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from '@swrx/core-model';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'swrx-pedido-view',
  templateUrl: './pedido-view.component.html',
  styleUrls: ['./pedido-view.component.scss']
})
export class PedidoViewComponent implements OnInit {
  pedido: Pedido;
  pedido$: Observable<Pedido>;
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

  constructor(private route: ActivatedRoute, private service: PedidoService) {}

  ngOnInit() {
    // this.route.paramMap.subscribe(params => console.log(params.get('id')));
    this.pedido$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.service.get(id)),
      tap(p => console.log('Pedido: ', p.partidas)),
      takeUntil(this.destroy$)
    );
  }
}
