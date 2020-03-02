import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';

import { PedidoLog } from '@swrx/core-model';
import { LogsFacade } from '../+state/logs/logs.facade';

@Component({
  selector: 'swrx-pedidos-dashboard',
  templateUrl: './pedidos-dashboard.component.html',
  styleUrls: ['./pedidos-dashboard.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosDashboardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  partidas$: Observable<PedidoLog[]>;
  constructor(private facade: LogsFacade) {}

  ngOnInit() {
    this.partidas$ = this.facade.allLogs$;
  }

  ngOnDestroy() {
    console.log('Saliendo de Pedidos Dashboard...');
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
