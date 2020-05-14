import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido, Periodo } from '@swrx/core-model';
import { PedidoService } from '../../services/pedido.service';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'swrx-pedidos-cerrados',
  templateUrl: './cerrados.component.html',
  styleUrls: ['./cerrados.component.scss']
})
export class CerradosComponent implements OnInit {
  pedidos: Pedido[] = [];
  periodo: Periodo;
  STORAGE_KEY = 'sx-callcenter.pedidos.cerrados.periodo';

  constructor(private service: PedidoService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Init component...');
    this.periodo = Periodo.fromStorage(this.STORAGE_KEY, Periodo.fromNow(45));
  }

  reload() {
    this.service
      .findPeddos(this.periodo)
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
}
