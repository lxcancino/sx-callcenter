package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import java.sql.SQLException

import groovy.util.logging.Slf4j

import org.springframework.scheduling.annotation.Scheduled


import grails.compiler.GrailsCompileStatic

import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.Query
import com.google.cloud.firestore.QuerySnapshot
import com.google.cloud.firestore.QueryDocumentSnapshot
import com.google.cloud.firestore.DocumentSnapshot
import com.google.api.core.ApiFuture


import org.apache.commons.lang3.exception.ExceptionUtils

import sx.utils.Periodo
import sx.core.Producto
import sx.callcenter.Pedido


/**
* Service class para mantener parte del estado del pedido en FirebaseStore
*
**/
@Slf4j
// @GrailsCompileStatic
class LxPedidoService {

    FirebaseService firebaseService

    LxPedidoLogService lxPedidoLogService

    def push(Pedido pedido) {
        Map changes = buildToFirebase(pedido)
        log.debug('Pedido changes to firebase: {}', changes.class)
        ApiFuture<WriteResult> result = firebaseService.getFirestore()
            .collection('pedidos')
            .document(pedido.id)
            .set(changes, SetOptions.merge())
        
        def updateTime = result.get().getUpdateTime()
        log.debug("Publish time : {} " , updateTime)
    }

    Map buildToFirebase(Pedido p) {
        LxPedido pedido = new LxPedido(p)
        Map<String, Object> data = pedido.properties 
        data = data.findAll{ k, v -> k != 'class'}
        if(p.socio) {
            data.socio = p.socio.id
        }
        if(p.envio) {
            Map direccion = toFirebaseMap(p.envio.direccion)
            direccion.latitud = null
            direccion.longitud = null
            Map envio = [
                tipo: p.envio.tipo, 
                telefono: p.envio.telefono,
                contacto: p.envio.contacto,
                horario: p.envio.horario,
                comentario: p.envio.comentario,
                direccion: direccion,
                transporte: p.envio?.transporte?.id,
                fechaDeEntrega: p.envio.fechaDeEntrega
            ]
            data.envio = envio
        }
        def partidas = p.partidas.collect{new LxPedidoDet(it).toFirebaseMap()}
        data.partidas = partidas
        return data
    }

    Map toFirebaseMap(def source) {
        Map<String, Object> data = source.properties 
        Map res = filter(data)
        return res
    }

    Map filter(Map data) {
        data = data.findAll{ k, v -> !['class','version', 'constraints', 'errors','metaClass', 'additionalMetaMethods'].contains(k) }
        return data
    }

    
    void cerrar(Pedido pedido) {
        log.debug('Cerrando pedido: {}', pedido.id);
        def db = firebaseService.getFirestore()
        final pedidoRef = db.document("pedidos/${pedido.id}")
        final pedidoLogRef = db.document("pedidos_log/${pedido.id}")

        
        Date cerrado = new Date()
        def function = { transaction -> 

            Map pedidoChanges = buildToFirebase(pedido)

            // Retrive Depositos
            Query depositosQuery = findDepositoRef(pedido.id)
            ApiFuture<QuerySnapshot> future = transaction.get(depositosQuery)
            
            List<DocumentReference> depositos = [] 
            future.get().getDocuments().each { depositoSnapshot ->
                if(depositoSnapshot.exists()) {
                    DocumentReference docRef = depositoSnapshot.getReference()
                    depositos.add(docRef)
                }
            }

            // Pedido
            transaction.set(pedidoRef, pedidoChanges, SetOptions.merge())
            log.debug('Pedido: {} CERRADO ', pedido.folio)

            // Log
            Map logChanges = [cerrado: pedido.cerrado, status: 'CERRADO']
            DocumentSnapshot logSnap = pedidoLogRef.get().get()
            
            if(!logSnap.exists()) {
                log.debug('No existe Log del pedido generandolo....')
                logChanges = lxPedidoLogService.buildToFirebase(pedido)
                logChanges.cerrado = pedido.cerrado
                transaction.set(pedidoLogRef, logChanges)
                log.debug('PedidoLog  {} ACTUALIZADO', pedido.folio)
            } else {
                transaction.update(pedidoLogRef, logChanges)
                log.debug('PedidoLog  {} ACTUALIZADO', pedido.folio)
            }

            // Depositos
            depositos.each { docRef ->
                Map changes = [cerrado: true, ceradoTime: new Date()]
                log.debug('Deposito relacionado: {} CERRADO', docRef.getId())
                transaction.update(docRef, changes)
            }
            return null;
        }

        ApiFuture<Void> future = db.runTransaction(function)
        future.get()
    }

    private Query findDepositoRef(String id) {
        return firebaseService.getFirestore()
            .collection('depositos')
            .whereEqualTo("pedido.id", id)
            .limit(1)
    }


    /**

    /// Retrieve Pedido and update fields
            Map pedidoChanges = buildToFirebase(pedido)
            transaction.update(pedidoRef, pedidoChanges);
            log.debug('Pedido cerrado')

            /// Retrieve PedidoLog and update fields
            Map logChanges = [cerrado: pedido.cerrado, status: 'CERRADO']
            transaction.update(pedidoLogRef, pedidoChanges);
            log.debug('PedidoLog actualizado')

            // Retrive Depositos
            Query depositosQuery = findDepositoRef(pedido.id)
            ApiFuture<QuerySnapshot> future = transaction.get(depositosQuery)
            List<QueryDocumentSnapshot> depositos = future.get().getDocuments()
            depositos.each { depositoSnapshot ->
                DocumentReference docRef = depositoSnapshot.getReference()
                Map canges = [cerrado: new Date(), estado: 'CERRADO']
                log.debug('Deposito relacionado: {} actualizado', depositoSnapshot.getLong('folio'))
            }
    **/

}
