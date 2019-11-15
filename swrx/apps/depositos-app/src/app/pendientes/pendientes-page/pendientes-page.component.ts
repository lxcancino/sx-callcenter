import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MatDialog } from '@angular/material';

import { AutorizarItemComponent } from '../autorizar-item/autorizar-item.component';
import { RechazarItemComponent } from '../rechazar-item/rechazar-item.component';

import { DepositoService, Deposito } from '@swrx/depositos';

import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'swrx-pendientes-page',
  templateUrl: './pendientes-page.component.html',
  styleUrls: ['./pendientes-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendientesPageComponent implements OnInit {
  pendientes$: Observable<Deposito[]>;

  constructor(private dialog: MatDialog, private service: DepositoService) {}

  ngOnInit() {
    this.pendientes$ = this.service.fetchDepositosByStatus('PENDIENTE');
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
            changes: { autorizacion: auth, estado: 'AUTORIZADO' }
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
            changes: { rechazo: res, estado: 'RECHAZADO' }
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
