package sx.audit

import grails.events.annotation.Subscriber


import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.model.PersistentEntity

import sx.core.Cliente
import sx.cloud.FirebaseService

@Slf4j
@GrailsCompileStatic
class ClienteListenerService {
    
    FirebaseService firebaseService

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
            def medios = cliente.medios.collect {
                filtrarMedio(it.properties)
            }
            def direcciones = cliente.direcciones?.collect{it.toFirebaseMap() }
            
            Map logData = [
                clienteId: cliente.id, 
                nombre: cliente.nombre, 
                rfc: cliente.rfc,
                clave: cliente.clave,
                sucursal: 'CALLCENTER',
                direccion: cliente.direccion.toFirebaseMap(),
                medios: medios,
                direcciones: direcciones,
                _status: 'PENDIENTE',
                _creado: new Date(),
                _tipo: 'INSERT']
            firebaseService.addDocument('clientes_log', logData)
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        Cliente cliente = getCliente(event)
        if ( cliente ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, cliente.id)
            
            def medios = cliente.medios.collect {
                filtrarMedio(it.properties)
            }
            def direcciones = cliente.direcciones?.collect{it.toFirebaseMap() }
            
            Map logData = [
                clienteId: cliente.id, 
                nombre: cliente.nombre, 
                medios: medios,
                direcciones: direcciones,
                _status: 'PENDIENTE',
                _creado: new Date(),
                _tipo: 'UPDATE']
            firebaseService.addDocument('clientes_log', logData)
        }
    }
    

    Map filtrarMedio(Map data) {
        data = data.findAll{ k, v -> !['class','constraints', 'errors', 'cliente', 'sw2'].contains(k) }
        return data
    }
    

    // void logEntity(Cliente cliente, String type) {
    //     log.debug('Log tipo: {} Cliente: {}',type, cliente.id)
    //     Audit.withNewSession {
    //         Audit alog = new Audit(
    //             name: 'Cliente',
    //             persistedObjectId: cliente.id,
    //             source: 'CALLCENTER',
    //             target: 'OFICINAS',
    //             tableName: 'cliente',
    //             eventName: type
    //         )
    //         alog.save failOnError: true, flush: true
    //     }
    // }

    
}
