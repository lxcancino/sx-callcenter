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

    ClienteService clienteService

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

    // @Override
    // protected Cliente createResource() {
    //     Cliente res = new Cliente()
    //     bindData res, getObjectToBind()
    //     res.clave = 'CVE_PENDIENTE'
    //     return res
    // }

    @Override
    protected Cliente saveResource(Cliente resource) {
        return clienteService.save(resource)
    }


    /*
    @Override
    protected Cliente updateResource(Cliente cliente) {
        cliente.save failOnError: true, flush: true
        cliente.direcciones.each { row ->
            log.info('Salvando direccion: {}', row.class.name)
            // dd.save failOnError: true, flush: true
        }
        log.info('Coloinas despues: {}', cliente.direcciones.collect{it.direccion.colonia})
        return cliente
        // return pedidoService.save(resource)
    }
    */


    
    def update() {
        String id = params.id as String
        Cliente cliente = Cliente.get(id)
        
        log.info('Colonias antes: {}', cliente.direcciones.collect{it.direccion.colonia})
        bindData cliente, getObjectToBind()
        cliente.save failOnError: true, flush: true
        cliente.direcciones.each { row ->
            def clone = new Direccion()
            clone.properties = row.direccion.properties
            row.direccion = clone
            println 'CD: ' + row.direccion.toLabel()
            row.save failOnError: true, flush: true
            log.info('Id: {}', row.id)
            log.info('Nuevo: {}', ClienteDireccion.get(row.id).direccion.colonia)
        }
        respond cliente, view: 'show'
    }


}
