package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import java.sql.SQLException


import groovy.util.logging.Slf4j


import grails.util.Environment
import org.springframework.scheduling.annotation.Scheduled

import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.Query
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.CollectionReference
import com.google.api.core.ApiFuture

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.utils.Periodo
import sx.core.Producto
import sx.callcenter.Pedido





/**
* Este bean es de prueba en el call center no se ocupa
**/
@Slf4j
class LxPedidoService {


    FirebaseService firebaseService
    

    static String TIME_FORMAT = 'dd/MM/yyyy HH:mm'

    static String ENTITY = 'CloudPedido'

    def push(Pedido pedido) {
        Map data = buildToFirebase(pedido)
        ApiFuture<WriteResult> result = firebaseService.getFirestore()
            .collection('pedidos')
            .document(pedido.id)
            .set(data)
        def updateTime = result.get().getUpdateTime()
        log.debug("Publish time : {} " , updateTime)
        return updateTime
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

    private toFirebaseMap(def source) {
        Map<String, Object> data = source.properties 
        data = data.findAll{ k, v -> k != 'class'}
        return data
    }
    

}
