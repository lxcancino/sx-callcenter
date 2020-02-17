package sx.audit

import grails.events.annotation.Subscriber


import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent


import sx.core.Cliente

@Slf4j
@GrailsCompileStatic
class ClienteListenerService {
    

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Cliente ) {
            return ((Cliente) event.entityObject).id
        }
        null
    }

    Cliente getCliente(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Cliente ) {
            return (Cliente) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        Cliente cliente = getCliente(event)
        if ( cliente ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, cliente.id)
            logEntity(cliente, 'INSERT')
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        Cliente cliente = getCliente(event)
        if ( cliente ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, cliente.id)
            logEntity(cliente, 'UPDATE')
        }
    }
    

    void logEntity(Cliente cliente, String type) {
        log.debug('Log tipo: {} Cliente: {}',type, cliente.id)
        Audit.withNewSession {
            Audit alog = new Audit(
                name: 'Cliente',
                persistedObjectId: cliente.id,
                source: 'CALLCENTER',
                target: 'OFICINAS',
                tableName: 'cliente',
                eventName: type
            )
            alog.save failOnError: true, flush: true
        }
        
        

    }

    
}
