package sx.audit

import grails.events.annotation.Subscriber


import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent


import sx.callcenter.Pedido

@Slf4j
@GrailsCompileStatic
class PedidoListenerService {
    

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Pedido ) {
            return ((Pedido) event.entityObject).id
        }
        null
    }

    Pedido getPedido(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Pedido ) {
            return (Pedido) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        Pedido pedido = getPedido(event)
        if ( pedido ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, pedido.id)
            logEntity(pedido, 'INSERT')
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        Pedido pedido = getPedido(event)
        if ( pedido ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, pedido.id)
            logEntity(pedido, 'UPDATE')
        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        Pedido pedido = getPedido(event)
        if ( pedido ) {
            logEntity(pedido, 'DELETE')
        }
    }

    void logEntity(Pedido pedido, String type) {
        log.debug('Log tipo: {} Pedido: {}',type, pedido.id)
        Audit.withNewSession {
            Audit alog = new Audit(
                name: 'Pedido',
                persistedObjectId: pedido.id,
                source: 'CALLCENTER',
                target: pedido.sucursal,
                tableName: 'pedido',
                eventName: type
            )
            alog.save failOnError: true, flush: true
        }
        
        

    }

    
}
