import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { DepositosEntity } from '../+state/depositos.models';
import { map } from 'rxjs/operators';

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
