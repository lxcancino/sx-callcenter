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

  fetchDepositos(): Observable<Deposito[]> {
    return this._collection.snapshotChanges().pipe(
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
    this.logEntity(deposito.changes);
    const path = `depositos/${deposito.id}`;
    this.afs
      .doc(path)
      .update(deposito.changes)
      .then(value => console.log('Deposito actualizado satisfactriamente '))
      .catch(reason => {
        console.error('Error actualizando deposito: ', reason);
      });
  }

  save(deposito: Deposito) {
    deposito.estado = 'PENDIENTE';
    this.logEntity(deposito);
    this._collection
      .add(deposito)
      .then(docRef => {
        console.log('DocRef: ', docRef.id);
      })
      .catch(reason => {
        console.error('Error agregando deposito: ', reason);
      });
  }

  logEntity(deposito: Partial<Deposito>) {
    const user = this.getUsuario();
    if (!deposito.id) {
      deposito.createUser = user;
      deposito.sucursal = this.getSucursal();
    }
    deposito.vendedor = user;
    deposito.updateUser = this.getUsuario();
  }

  private getSucursal(): string {
    return 'CALLCENTEr';
  }
  private getUsuario(): string {
    return 'admin';
  }
}
