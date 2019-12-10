package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
// @Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@Secured("permitAll")
class ProductoController extends RestfulController<Producto> {
    static responseFormats = ['json']
    ProductoController() {
        super(Producto)
    }


    @Override
    protected List<Producto> listAllResources(Map params) {
        def query = Producto.where {}
        params.sort = params.sort ?:'clave'
        params.order = params.order ?:'asc'
        params.max = params.max?: 100

        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { clave =~ search || descripcion =~ search}
        }
        // query.where {linea.linea != 'CONTABLE' !! linea.linea != 'CORTE' }

        Boolean activos = this.params.getBoolean('activos', true)
        if(activos) query = query.where {activo == activos }

        Boolean deLinea = this.params.getBoolean('deLinea', true)
        if(deLinea) query = query.where {deLinea == deLinea}
        def result = query.list(params)
        
        return result
    }


}
