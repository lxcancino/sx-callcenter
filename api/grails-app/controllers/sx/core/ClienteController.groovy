package sx.core

import groovy.util.logging.Slf4j

import grails.rest.*
import grails.converters.*
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Secured("permitAll")
class ClienteController extends RestfulController<Cliente> {
    
    static responseFormats = ['json']

    ClienteService clienteService
    ReportService reportService

    ClienteController() {
        super(Cliente)
    }

    @Override
    protected List listAllResources(Map params) {
        // log.info('List: {}', params)
        params.max = 50
        def query = Cliente.where {}
        params.sort = params.sort ?:'nombre'
        params.order = params.order ?:'asc'
        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { nombre =~ search}
        }
        return query.list(params)
    }

    

    @Override
    protected Cliente saveResource(Cliente resource) {
        return clienteService.save(resource)
    }

    
    def update() {
        String id = params.id as String
        Cliente cliente = Cliente.get(id)
        bindData cliente, getObjectToBind()
        cliente.save failOnError: true, flush: true
        cliente.direcciones.each { row ->
            def clone = new Direccion()
            clone.properties = row.direccion.properties
            row.direccion = clone
            row.save failOnError: true, flush: true
        }
        respond cliente, view: 'show'
    }

    def nuevos(ClientesNuevosCommand command) {
        Map repParams = [:]
        repParams['SUCURSAL'] = '99'
        repParams['FECHA'] = command.fecha
        def pdf =  reportService.run('ClientesNuevos.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ClientesNuevos.pdf')
    }


}

class ClientesNuevosCommand {
    Date fecha
}
