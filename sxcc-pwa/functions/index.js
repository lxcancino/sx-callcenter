const functions = require('firebase-functions');

// import functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab text parameter
  const original = req.query.text;
  const writeResult = await admin.firestore().collection('messages').add({
    original,
  });
  res.json({ result: `Message with ID: ${writeResult.id} added` });
});

exports.makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    const original = snap.data().original;
    functions.logger.log('Uppercasing', context.params.documentId, original);
    const uppercase = original.toUpperCase();
    return snap.ref.set({ uppercase }, { merge: true });
  });

exports.onSavePedido = functions.firestore
  .document('/pedidos/{pedidoId}')
  .onCreate(async (snap, context) => {
    functions.logger.log('OnWrite: ', context.params.pedidoId);
    await db.collection('test').add({ pureba: 'OK' });
    return 0;
  });
// .onCreate((snap, context) => {
//   const pedido = snap.data();
//   pedido.folio = admin.firestore.FieldValue.increment(1);
//   pedido.dateCreated = admin.firestore.FieldValue.serverTimestamp();
//   pedido.lastUpdated = admin.firestore.FieldValue.serverTimestamp();
//   functions.logger.log('Alta de pedido: ', pedido);
//   return snap.ref.set(pedido, { merge: true });
// });
