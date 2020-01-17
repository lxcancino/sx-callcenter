package sx.audit

import grails.events.annotation.Subscriber


import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.model.PersistentEntity

// import org.hibernate.event.spi.PostUpdateEvent

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
            // log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, pedido.id)
            // logEntity(pedido, 'INSERT')
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        Pedido pedido = getPedido(event)
        if ( pedido ) {
            // log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, pedido.id)
            PersistentEntity pe = event.getEntity()
            // log.info('Persistent Entity: {}', pe)
            org.hibernate.event.spi.PostUpdateEvent he = (org.hibernate.event.spi.PostUpdateEvent)event.getNativeEvent()
            
            List nameMap = he.getPersister().getPropertyNames() as List
            Object[] oldState = he.getOldState()
            Object[] state = he.getState()
            def dirties = he.getDirtyProperties() as List
            // log.info('Dirty data: {}', dirties)
            dirties.each { idx ->
                int i = (int)idx
                String property = nameMap.get(i)
                if(property == 'status') {
                    String newState = state[i]
                    if(newState == 'CERRADO') {
                        log.info('Updated property: {}  Value: {}', nameMap.get(i),  newState)
                        log.info('Push Pedido {} to Firebase', pedido.folio)
                    }
                    
                }
            }
           // logEntity(pedido, 'UPDATE')
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
