import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RastreoService } from '../rastreo.service';
import { Observable } from 'rxjs';
import { Pedido } from '@swrx/core-model';


@Component({
  selector: 'swrx-rastreo-page',
  templateUrl: './rastreo-page.component.html',
  styleUrls: ['./rastreo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RastreoPageComponent implements OnInit {

  pedidos$: Observable<Pedido[]>;
  pedido: Pedido;

  constructor(private service: RastreoService) { }

  ngOnInit() {
  }

  reload(){
    this.pedidos$ = this.service.fetchPedidos();
    this.pedido = null;
  }

}
