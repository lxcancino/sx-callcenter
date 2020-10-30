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
    const docRef = await this.firestore.collection('pedidos').add(pedido);
    const snap = await docRef.get();
    console.log('Pedido registrado: ', snap.data());
  }

  async saveToCart2(pedido: Pedido) {
    console.log('Salvando pedido: ', pedido);

    const collectionRef = this.firestore.collection<Pedido>('carts').ref;
    const foliosRef = this.firestore.collection('config').doc('folios').ref;

    const id = this.firestore.createId();

    this.firestore.firestore.runTransaction((transaction) => {
      return transaction
        .get(foliosRef)
        .then(async (sfDoc) => {
          if (!sfDoc.exists) {
            throw 'No existe registro de folios en la coleccion config';
          }
          const currentFolio = sfDoc.data().pedidos || 3000;
          const nextFolio = currentFolio + 1;
          transaction
            .update(foliosRef, { pedidos: nextFolio })
            .set(collectionRef.doc(id), {
              ...pedido,
              id,
              folio: currentFolio,
              dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
              lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            });
        })
        .then(() => {
          console.log('Pedido registrado: ', id);
        });
    });
  }
}
