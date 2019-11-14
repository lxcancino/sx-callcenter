import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { DATA } from './data';
import { MatDialog } from '@angular/material';

import { AutorizarItemComponent } from '../autorizar-item/autorizar-item.component';
import { RechazarItemComponent } from '../rechazar-item/rechazar-item.component';

import { DepositoService, Deposito } from '@swrx/depositos';

import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
// import {  } from '@swrx/depositos'
// import { DepositoService } from '@swrx/depositos/src/lib/services/deposito.service';

@Component({
  selector: 'swrx-pendientes-page',
  templateUrl: './pendientes-page.component.html',
  styleUrls: ['./pendientes-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendientesPageComponent implements OnInit {
  pendientes: any[];

  pendientes$: Observable<Deposito[]>;

  constructor(private dialog: MatDialog, private service: DepositoService) {}

  ngOnInit() {
    this.pendientes = DATA;
    this.pendientes$ = this.service.fetchPendientes();
    this.pendientes$.subscribe(pend => console.log('Pendientes:', pend));
  }

  onAutorizar(event: Deposito) {
    this.dialog
      .open(AutorizarItemComponent, {
        data: { transaccion: event }
      })
      .afterClosed()
      .subscribe(auth => {
        if (auth && auth.uuid) {
          const update: Update<Deposito> = {
            id: event.id,
            changes: { autorizacion: auth }
          };
          // console.log('Autorizando deposito/transfrerencia: ', update);
          this.service.update(update);
        }
      });
  }

  onRechazar(event: any) {
    this.dialog
      .open(RechazarItemComponent, {
        data: { transaccion: event }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const update: Update<Deposito> = {
            id: event.id,
            changes: { rechazo: res }
          };
          // console.log('Rechazar: ', update);
          this.service.update(update);
        }
      });
  }
  onEliminar(event: any) {
    console.log('Eliminando deposito/transferencia: ', event);
  }
}
