package sx.core

 import groovy.transform.TupleConstructor

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
        params.max = params.rows ?: 50
        log.debug('Params: {}', params)

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

    def disponibles() {
        def query = Producto.where {}
        params.sort = params.sort ?:'clave'
        params.order = params.order ?:'asc'
        params.max = params.rows ?: 200
        // log.debug('Disponibles: {}', params)
        
        def search = '%' + params.term + '%'
        query = query.where { clave =~ search || descripcion =~ search}
        query = query.where { linea =~ search || marca =~search || clase =~ search}
        // query = query.where { largo =~ search || ancho =~search }
        // query = query.where { kilos =~ search || gramos =~search }
        
        
        Boolean activos = this.params.getBoolean('activos', true)
        if(activos) query = query.where {activo == activos }

        Boolean deLinea = this.params.getBoolean('deLinea', true)
        if(deLinea) query = query.where {deLinea == deLinea}
        

        def result = query.list(params)
        respond result

    }

    def disponibles2() {
        List<ProductoRow> productos = Producto.executeQuery("""
            select
            new sx.core.ProductoRow( 
                p.id, 
                p.clave, 
                p.descripcion, 
                p.largo, 
                p.ancho, 
                p.gramos, 
                p.calibre, 
                p.color,
                p.nacional, 
                p.presentacion, 
                p.linea, 
                p.marca, 
                p.clase, 
                p.precioContado, 
                p.precioCredito)
                from Producto p where p.activo = true and p.deLinea = true
            """)
        respond productos
    }


}

@TupleConstructor
class ProductoRow {
    String id
    String clave
    String descripcion
    BigDecimal largo 
    BigDecimal ancho
    BigDecimal gramos
    BigDecimal calibre 
    String color
    Boolean nacional 
    String presentacion 
    String linea 
    String marca 
    String clase 
    BigDecimal precioContado 
    BigDecimal precioCredito

}
