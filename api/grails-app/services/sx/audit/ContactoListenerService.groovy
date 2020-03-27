package sx.audit

import grails.events.annotation.Subscriber


import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.model.PersistentEntity

import sx.core.ComunicacionEmpresa
import sx.cloud.FirebaseService

@Slf4j
@GrailsCompileStatic
class ContactoListenerService {
    
    FirebaseService firebaseService

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof ComunicacionEmpresa ) {
            return ((ComunicacionEmpresa) event.entityObject).id
        }
        null
    }

    ComunicacionEmpresa getContacto(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof ComunicacionEmpresa ) {
            return (ComunicacionEmpresa) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        ComunicacionEmpresa contacto = getContacto(event)
        if ( contacto ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, contacto.id)
            Map logData = getFirbaseData(contacto)
            logData['_tipo'] = 'INSERT'
            logData['_creado'] = new Date()
            firebaseService.addDocument('cte_medios', logData)
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        ComunicacionEmpresa contacto = getContacto(event)
        if ( contacto ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, contacto.id)
            Map logData = getFirbaseData(contacto)
            logData['_tipo'] = 'UPDATE'
            logData['_creado'] = new Date()
            firebaseService.addDocument('cte_medios', logData)
        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        ComunicacionEmpresa contacto = getContacto(event)
        if ( contacto ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, contacto.id)
            Map logData = [
                id: contacto.id, 
                cliente: contacto.cliente.id, 
                descripcion: contacto.descripcion,
                _tipo: 'DELETE',
                _creado: new Date()
                ]
            firebaseService.addDocument('cte_medios', logData)
        }
    }

    Map getFirbaseData(ComunicacionEmpresa contacto) {
        def cliente = contacto.cliente
         return  [
                id: contacto.id,
                clienteId: cliente.id, 
                nombre: cliente.nombre,
                activo: contacto.activo,
                tipo: contacto.tipo,
                descripcion: contacto.descripcion,
                comentario: contacto.comentario,
                cfdi: contacto.cfdi,
                validado: contacto.validado,
                createUser: contacto.createUser,
                updateUser: contacto.updateUser,
                sucursalUpdated: 'CALLCENTER',
                sucursalCreated: 'CALLCENTER'
            ]
    }
    

    Map filtrarMedio(Map data) {
        data = data.findAll{ k, v -> !['class','constraints', 'errors', 'cliente', 'sw2'].contains(k) }
        return data
    }

    
}
