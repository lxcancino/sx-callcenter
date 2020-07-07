import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { MatDialog } from '@angular/material';

import { AutorizarItemComponent } from '../autorizar-item/autorizar-item.component';
import { RechazarItemComponent } from '../rechazar-item/rechazar-item.component';

import { DepositoService, Deposito } from '@swrx/depositos';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Update } from '@ngrx/entity';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'swrx-pendientes-page',
  templateUrl: './pendientes-page.component.html',
  styleUrls: ['./pendientes-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendientesPageComponent implements OnInit, OnDestroy {
  pendientes$: Observable<Deposito[]>;
  destroy$ = new Subject<boolean>();
  user: any;

  constructor(
    private dialog: MatDialog,
    private service: DepositoService,
    private firebaseAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.firebaseAuth.user.pipe(takeUntil(this.destroy$)).subscribe(usr => {
      const { displayName, email } = usr;
      this.user = { displayName, email };
    });
    this.pendientes$ = this.service.fetchDepositosByStatus('PENDIENTE');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onAutorizar(event: Deposito) {
    this.dialog
      .open(AutorizarItemComponent, {
        data: { transaccion: event },
        width: '750px'
      })
      .afterClosed()
      .subscribe(auth => {
        if (auth && auth.uuid) {
          const autorizacion = {
            ...auth,
            user: this.user ? this.user.displayName : ''
          };
          const update: Update<Deposito> = {
            id: event.id,
            changes: { autorizacion, estado: 'AUTORIZADO' }
          };
          // console.log('Autorizando deposito/transfrerencia: ', update);
          this.service.update(update);
        }
      });
  }

  onRechazar(event: any) {
    this.dialog
      .open(RechazarItemComponent, {
        data: { transaccion: event },
        width: '550px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const rechazo = {
            ...res,
            user: this.user ? this.user.displayName : ''
          };
          const update: Update<Deposito> = {
            id: event.id,
            changes: { rechazo, estado: 'RECHAZADO' }
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
