import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../../core-model/src/lib/pedido-models';
import { map } from 'rxjs/operators'

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RastreoService {

  private _collection: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    console.log('Inicializando Pedidos collection...');
    this._collection = this.afs.collection('pedidos');
   
  }

  
  fetchPedidos(): Observable<Pedido[]> {
    return this._collection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Pedido;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
}
