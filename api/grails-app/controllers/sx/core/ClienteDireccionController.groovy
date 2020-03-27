package sx.core

import groovy.util.logging.Slf4j

import grails.rest.*
import grails.converters.*
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured



@Slf4j
@GrailsCompileStatic
@Secured("permitAll")
class ClienteDireccionController extends RestfulController<ClienteDireccion> {
    
    static responseFormats = ['json']

    ClienteDireccionController() {
        super(ClienteDireccion)
    }

    @Override
    protected List<ClienteDireccion> listAllResources(Map params) {
        def query = ClienteDireccion.where{cliente.id == params.clienteId}
        return query.list()
    }

    

}
