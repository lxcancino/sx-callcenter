import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';

import {
  AngularFirestore,
  DocumentChangeAction
} from '@angular/fire/firestore';
import { PedidoLog, FacturacionLog } from '@swrx/core-model';

import { firestore } from 'firebase/app';

import forOwn from 'lodash/forOwn';

function mapTimeStamps(data: any) {
  const res = { ...data };
  forOwn(res, (value, key, obj) => {
    if (value instanceof firestore.Timestamp) {
      const time = value as firestore.Timestamp;
      obj[key] = time.toDate();
    }
  });
  return res;
}

function mapToPedidoLog(action: DocumentChangeAction<any>) {
  const data = action.payload.doc.data();
  const id = action.payload.doc.id;
  forOwn(data, (value, key, obj) => {
    if (value instanceof firestore.Timestamp) {
      const time = value as firestore.Timestamp;
      obj[key] = time.toDate();
    }
    if (key === 'facturacion') {
      const facturacion = obj[key];
      if (facturacion && facturacion.creado) {
        const time = facturacion.creado as firestore.Timestamp;
        facturacion.creado = time.toDate();
      }
    }
    if (key === 'embarqueLog') {
      obj[key] = mapTimeStamps(value);
    }
  });
  return { id, ...data };
}

function mapToPedidoLog2(data: any) {
  forOwn(data, (value, key, obj) => {
    if (value instanceof firestore.Timestamp) {
      const time = value as firestore.Timestamp;
      obj[key] = time.toDate();
    }
    if (key === 'facturacion') {
      const facturacion = obj[key];
      if (facturacion && facturacion.creado) {
        const time = facturacion.creado as firestore.Timestamp;
        facturacion.creado = time.toDate();
      }
    }
    if (key === 'embarqueLog') {
      obj[key] = mapTimeStamps(value);
    }
  });
  return { ...data };
}
@Component({
  selector: 'swrx-pedidos-dashboard',
  templateUrl: './pedidos-dashboard.component.html',
  styleUrls: ['./pedidos-dashboard.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosDashboardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  partidas: PedidoLog[] = [];
  partidas$ = new Subject<PedidoLog[]>();
  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.fetchLog();
  }
  ngOnDestroy() {
    console.log('Saliendo de Pedidos Dashboard...');
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  fetchLog() {
    this.afs
      .collection('pedidos_log')
      .valueChanges()
      .pipe(
        map(actions => actions.map(mapToPedidoLog2)),
        // map((rows: any[]) => rows.filter(item => item.hasOwnProperty('folio'))), // Hack para evitar
        takeUntil(this.destroy$)
      )
      .subscribe(pedidos => {
        this.partidas = pedidos;
        console.log('Pedidos: ', pedidos);
        this.partidas$.next(pedidos);
      });
  }
}
