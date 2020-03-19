import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { DepositosEntity, Deposito } from '../+state/depositos.models';
import { map, take } from 'rxjs/operators';
import { Update } from '@ngrx/entity';

import uuidv4 from 'uuid/v4';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {
  private _collection: AngularFirestoreCollection<DepositosEntity>;

  constructor(private afs: AngularFirestore) {
    console.log('Inicializando depositos collection...');
    this._collection = this.afs.collection<DepositosEntity>('depositos');
  }

  fetchDepositos(): Observable<Deposito[]> {
    return this.afs
      .collection<DepositosEntity>('depositos', ref =>
        ref.orderBy('folio', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Deposito;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  fetchPendientes(): Observable<Deposito[]> {
    return this.fetchDepositosByStatus('PENDIENTE');
  }

  fetchRechazados(): Observable<Deposito[]> {
    return this.fetchDepositosByStatus('RECHAZADO');
  }

  fetchDepositosByStatus(
    status: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO'
  ): Observable<Deposito[]> {
    return this.afs
      .collection('depositos', ref => ref.where('estado', '==', status))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Deposito;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  update(deposito: Update<Deposito>) {
    const path = `depositos/${deposito.id}`;
    const data = { ...deposito.changes };
    this.afs
      .doc(path)
      .update(data)
      .then(value => console.log('Deposito actualizado satisfactriamente '))
      .catch(reason => {
        console.error('Error actualizando deposito: ', reason);
      });
  }

  save(deposito: Deposito) {
    deposito.estado = 'PENDIENTE';
    deposito.id = uuidv4();
    const folioRef = this.afs.collection('config').doc('folios').ref;
    const depositoRef = this._collection.doc(deposito.id).ref;

    this.afs.firestore.runTransaction(transacion => {
      return transacion
        .get(folioRef)
        .then(sDoc => {
          if (!sDoc.exists) {
            transacion.set(folioRef, { depositos: 1 });
            deposito.folio = 1;
            transacion.set(depositoRef, deposito);
            return 1;
          } else {
            const fols = sDoc.data();
            const folio = (fols.depositos || 0) + 1;
            transacion.update(folioRef, { depositos: folio });
            deposito.folio = folio;
            transacion.set(depositoRef, deposito);
            return folio;
          }
        })
        .then(newFolio => console.log('Deposito generado: ', newFolio))
        .catch(error => console.error('Error :', error));
    });
  }

  buscarDuplicado(total: number, banco): Observable<any | Deposito> {
    return this.afs
      .collection('depositos', ref =>
        ref.where('total', '==', total).where('banco', '==', banco)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Deposito;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}
