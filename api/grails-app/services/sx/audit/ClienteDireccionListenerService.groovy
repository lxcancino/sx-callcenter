package sx.audit

import grails.events.annotation.Subscriber


import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.model.PersistentEntity

import sx.core.ClienteDireccion
import sx.cloud.FirebaseService

@Slf4j
@GrailsCompileStatic
class ClienteDireccionListenerService {
    
    FirebaseService firebaseService

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof ClienteDireccion ) {
            return ((ClienteDireccion) event.entityObject).id
        }
        null
    }

    ClienteDireccion getClienteDireccion(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof ClienteDireccion ) {
            return (ClienteDireccion) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        ClienteDireccion clienteDireccion = getClienteDireccion(event)
        if ( clienteDireccion ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, clienteDireccion.id)
            // firebaseService.addDocument('ClienteDireccions_log', logData)
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        ClienteDireccion clienteDireccion = getClienteDireccion(event)
        if ( clienteDireccion ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, clienteDireccion.id)
            // firebaseService.addDocument('ClienteDireccions_log', logData)
        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        ClienteDireccion clienteDireccion = getClienteDireccion(event)
        if ( clienteDireccion ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, clienteDireccion.id)
            // firebaseService.addDocument('ClienteDireccions_log', logData)
        }
    }
    

    Map filtrarMedio(Map data) {
        data = data.findAll{ k, v -> !['class','constraints', 'errors', 'cliente', 'sw2'].contains(k) }
        return data
    }

    
}
