package sx.core

import groovy.util.logging.Slf4j

import grails.rest.*
import grails.converters.*
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

@Slf4j
@GrailsCompileStatic
@Secured("permitAll")
class ClienteController extends RestfulController<Cliente> {
    
    static responseFormats = ['json']

    ClienteController() {
        super(Cliente)
    }

    @Override
    protected List listAllResources(Map params) {
        log.info('List: {}', params)
        params.max = 15
        def query = Cliente.where {}
        params.sort = params.sort ?:'nombre'
        params.order = params.order ?:'asc'
        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { nombre =~ search}
        }
        return query.list(params)
    }


}
