import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { map, delay, take } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import forOwn from 'lodash/forOwn';

import { PedidoLog } from '@swrx/core-model';
import {
  AngularFirestore,
  DocumentChangeAction,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

export function mapTimeStamps(data: any) {
  const res = { ...data };
  forOwn(res, (value, key, obj) => {
    if (value instanceof firestore.Timestamp) {
      const time = value as firestore.Timestamp;
      obj[key] = time.toDate();
    }
  });
  return res;
}

export function mapToPedidoLog(action: DocumentChangeAction<any>) {
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

@Injectable()
export class LogService {
  _register$ = new Subject<boolean>();

  private _collection: AngularFirestoreCollection<PedidoLog>;

  constructor(private afs: AngularFirestore) {}

  getPedidosLogSateChanges() {
    return this.afs
      .collection<PedidoLog>('pedidos_log', ref =>
        ref
          // .where('status', '>=', 'COTIZACION')
          .orderBy('folio', 'desc')
          .limit(1000)
      )
      .snapshotChanges();
  }

  fetchLogs(): Observable<PedidoLog[]> {
    return (
      this.afs
        .collection<PedidoLog>('pedidos_log', ref =>
          ref.orderBy('folio', 'desc').limit(3000)
        )
        .snapshotChanges()
        //.stateChanges(['added', 'modified'])
        .pipe(
          take(1),
          map(actions => actions.map(mapToPedidoLog))
        )
    );
  }

  fetchLogsByType(status: string) {
    return (
      this.afs
        .collection<PedidoLog>('pedidos_log', ref =>
          ref.orderBy('folio', 'desc').limit(3000)
        )
        .snapshotChanges()
        //.stateChanges(['added', 'modified'])
        .pipe(
          take(1),
          map(actions => actions.map(mapToPedidoLog))
        )
    );
  }

  initCollection() {
    this._collection = this.afs.collection<PedidoLog>('pedidos_log', ref =>
      ref.orderBy('folio', 'desc').limit(1000)
    );
  }
}
