package sx.cloud


import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic

import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.Query
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot

import com.google.api.core.ApiFuture

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.callcenter.Pedido
/**
* 
**/
@Slf4j
// @GrailsCompileStatic
class LxPedidoLogService {

    FirebaseService firebaseService

    final String COLLECTION = 'pedidos_log'

    void publishLog(Pedido pedido) {
        Map data = buildToFirebase(pedido)
        publishLog(pedido.id, data)
    }

    void publishLog(String id, Map changes) {
        ApiFuture<WriteResult> result = firebaseService.getFirestore()
            .collection(COLLECTION)
            .document(id)
            .set(changes, SetOptions.merge())
        def updateTime = result.get().getUpdateTime().toDate().format('dd/MM/yyyy')
        log.debug("PedidoLog updated time : {} " , updateTime)
        updateTime
    }

    Map buildToFirebase(Pedido p) {
        Map pedidoLog = [
            pedido: p.id,
            folio: p.folio,
            nombre: p.nombre,
            fecha: p.fecha,
            sucursal: p.sucursal,
            status: p.status,
            envio: p.envio != null,
            inicio: p.inicio,
            dateCreated: p.dateCreated,
            lastUpdated: p.lastUpdated,
            createUser: p.createUser,
            updateUser: p.updateUser
        ]
        return pedidoLog
    }
    
    Map toFirebaseMap(Map data) {
        data = data.findAll{ k, v -> !['class','constraints', 'errors'].contains(k) }
        return data
    }
    

}
