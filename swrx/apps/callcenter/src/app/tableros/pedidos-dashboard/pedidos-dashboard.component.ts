import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil, map, tap, filter } from 'rxjs/operators';

import { PedidoLog } from '@swrx/core-model';
import { LogsFacade } from '../+state/logs/logs.facade';
import { LogService } from '../+state/services/log.service';

@Component({
  selector: 'swrx-pedidos-dashboard',
  templateUrl: './pedidos-dashboard.component.html',
  styleUrls: ['./pedidos-dashboard.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosDashboardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  partidas$: Observable<PedidoLog[]>;
  timer$: Observable<any>;
  constructor(private facade: LogsFacade, private service: LogService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.partidas$ = this.service.fetchLogs().pipe(
      map(logs => logs.filter(item => item.status !== 'COTIZACION')),
      // tap(data => console.log('Logs detected: ', data)),
      map(logs =>
        logs.filter(logItem => {
          if (logItem.envio && logItem.embarqueLog) {
            if (logItem.embarqueLog) {
              const embarqueLog = logItem.embarqueLog;
              const completo: boolean = !embarqueLog.recepcion;
              return completo;
            } else {
              return true;
            }
          } else {
            return !logItem.facturacion;
          }
        })
      ),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    console.log('Saliendo de Pedidos Dashboard...');
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
