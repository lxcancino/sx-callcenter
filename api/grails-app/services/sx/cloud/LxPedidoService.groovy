package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import java.sql.SQLException

import groovy.util.logging.Slf4j

import org.springframework.scheduling.annotation.Scheduled


import grails.compiler.GrailsCompileStatic

import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
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
@GrailsCompileStatic
class LxPedidoService {

    FirebaseService firebaseService

    def push(Pedido pedido) {
        try {
            Map changes = buildToFirebase(pedido)
            ApiFuture<WriteResult> result = firebaseService.getFirestore()
                .collection('pedidos')
                .document(pedido.id)
                .set(changes, SetOptions.merge())
            
            def updateTime = result.get().getUpdateTime()
            log.debug("Publish time : {} " , updateTime)
        
        }catch (Exception ex) {
            String msg = ExceptionUtils.getRootCauseMessage(ex)
            log.error('Error actualizando PedidoLog en Firebase {}', msg)
        }
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
        data = data.findAll{ k, v -> k != 'class'}
        return data
    }
    

}
