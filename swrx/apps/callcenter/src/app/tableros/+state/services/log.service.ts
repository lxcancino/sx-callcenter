import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
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
    if (this._collection == null) {
      console.log('Cargar coleccion....');
      this.initCollection();
    }
    return this._collection.stateChanges();
  }

  fetchLogs(): Observable<PedidoLog[]> {
    return this.afs
      .collection<PedidoLog>('pedidos_log', ref =>
        ref.orderBy('folio', 'desc').limit(1000)
      )
      .stateChanges(['added', 'modified'])
      .pipe(map(actions => actions.map(mapToPedidoLog)));
  }

  initCollection() {
    this._collection = this.afs.collection<PedidoLog>('pedidos_log', ref =>
      ref.orderBy('folio', 'desc').limit(1000)
    );
  }
}
