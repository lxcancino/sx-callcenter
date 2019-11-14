import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { DepositosEntity, Deposito } from '../+state/depositos.models';
import { map } from 'rxjs/operators';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {
  private _collection: AngularFirestoreCollection<DepositosEntity>;

  constructor(private afs: AngularFirestore) {
    console.log('Inicializando depositos collection...');
    this._collection = this.afs.collection<DepositosEntity>('depositos');
  }

  fetchDepositos(): Observable<DepositosEntity[]> {
    return this._collection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as DepositosEntity;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  fetchPendientes(): Observable<Deposito[]> {
    return this.afs
      .collection('depositos', ref =>
        ref.where('autorizacion', '==', null).where('rechazo', '==', null)
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

  update(deposito: Update<Deposito>) {
    const path = `depositos/${deposito.id}`;
    this.afs
      .doc(path)
      .update(deposito.changes)
      .then(value => console.log('Update value: ', value))
      .catch(reason => {
        console.error('Error actualizando deposito: ', reason);
      });
  }

  save(deposito: DepositosEntity) {
    this._collection
      .add(deposito)
      .then(docRef => {
        console.log('DocRef: ', docRef.id);
      })
      .catch(reason => {
        console.error('Error agregando deposito: ', reason);
      });
  }
}
