package sx.core

import groovy.util.logging.Slf4j

import grails.rest.*
import grails.converters.*
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

@Slf4j
@GrailsCompileStatic
@Secured("permitAll")
class TransporteController extends RestfulController<Transporte> {
    
    static responseFormats = ['json']

    TransporteController() {
        super(Transporte)
    }

    @Override
    protected List<Transporte> listAllResources(Map params) {
        return Transporte.list()
    }


}
