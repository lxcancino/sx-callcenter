package sx.core

import groovy.util.logging.Slf4j

import grails.rest.*
import grails.converters.*
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured



@Slf4j
@GrailsCompileStatic
@Secured("permitAll")
class ComunicacionEmpresaController extends RestfulController<ComunicacionEmpresa> {
    
    static responseFormats = ['json']

    ComunicacionEmpresaController() {
        super(ComunicacionEmpresa)
    }

    @Override
    protected List<ComunicacionEmpresa> listAllResources(Map params) {
        def query = ComunicacionEmpresa.where{cliente.id == params.clienteId}
        return query.list()
    }

    

}
