import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const onCreatePedido = functions.firestore
  .document('pedidos/{pedidoId}')
  .onCreate(async (snapshot, context) => {
    functions.logger.log('Pedido salvado: ', context.params.pedidoId);

    const data = snapshot.data();
    const ap = await db.collection('analytics').doc('pedidos').get();
    if (!ap.exists) {
      await ap.ref.set({ count: 1 });
    } else {
      const ad = ap.data();
      if (ad) {
        const newCount = ad.count + 1;
        console.log('New count:  ', newCount);
        await ap.ref.set({ count: newCount });
      }
    }
    console.log('Cliente: ', data.nombre);
    return 0;
  });
