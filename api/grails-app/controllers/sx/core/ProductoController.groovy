package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

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
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 100

        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { clave =~ search || descripcion =~ search}
        }

        Boolean activos = this.params.getBoolean('activos', true)
        if(activos) query = query.where {activo == activos}

        Boolean deLinea = this.params.getBoolean('deLinea')
        if(deLinea) query = query.where {deLinea == deLinea}

        return query.list(params)
    }
}
