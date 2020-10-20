import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Pedido } from 'src/app/models';
import { buildNewPedido } from './pedido.utils';
// import * as firebase from 'firebase';
import * as firebase from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class PedidosFacade {
  current$: Observable<Pedido>;
  newPedido$ = new BehaviorSubject<Pedido>(buildNewPedido()).pipe(
    shareReplay()
  );
  constructor(private firestore: AngularFirestore) {}

  async saveToCart(pedido: Pedido) {
    /*
    const id = this.firestore.createId();
    const data = {
      ...pedido,
      folio: 100,
      id,
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = this.firestore.collection<Pedido>('carts').doc(id);

    await docRef.set(data);
    console.log('Save: ', docRef);
    */
    this.firestore.collection('pedidos').add(pedido);
  }

  async savePedido(pedido: Pedido) {
    console.log('Salvando pedido: ', pedido);

    const collectionRef = this.firestore.collection<Pedido>('carts').ref;
    const foliosRef = this.firestore.collection('config').doc('folios').ref;
    const id = this.firestore.createId();

    this.firestore.firestore.runTransaction((transaction) => {
      return transaction
        .get(foliosRef)
        .then((sfDoc) => {
          if (!sfDoc.exists) {
            throw 'No existe registro de folios en la coleccion config';
          }
          const currentFolio = sfDoc.data().pedidos || 3000;
          const nextFolio = currentFolio + 1;
          transaction
            .update(foliosRef, { pedidos: nextFolio })
            .set(collectionRef.doc(id), {
              ...pedido,
              folio: currentFolio,
              dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
              lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            });
        })
        .then((res) => {
          console.log('Pedido registrado: ', id);
        });
    });
  }
}
