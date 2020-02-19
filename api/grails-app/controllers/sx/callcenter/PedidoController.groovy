package sx.callcenter

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic

import grails.rest.*
import grails.converters.*
import grails.compiler.GrailsCompileStatic

import grails.plugin.springsecurity.annotation.Secured

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo
import sx.utils.ImporteALetra

@Slf4j
@GrailsCompileStatic
// @Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class PedidoController extends RestfulController<Pedido> {
    static responseFormats = ['json']

    ReportService reportService
    PedidoService pedidoService

    PedidoController() {
        super(Pedido)
    }

    /*
    def show() {
        Pedido found = Pedido.get(params.id as String)
        log.info('Found pedido: {}', found.folio)
        return found
    }
    */

    @Override
    @CompileDynamic
    protected List<Pedido> listAllResources(Map params) {
        // log.debug('List: {}', params)
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = 1000
        def periodo = params.periodo
        def query = Pedido.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        return query.list(params);
    }

    @CompileDynamic
    protected Pedido createResource() {
        Pedido res = new Pedido()
        bindData res, getObjectToBind()
        res.folio = -1L
        res.status = 'COTIZACION'
        // res.createUser = 'TEMPO'
        // res.updateUser = 'TEMPO'
        if(res.envio) {
            log.info('Envio: {}' , res.envio) // Hack para salvar correctamente el envio *** ???
            res.envio.pedido = res
        }
        return res
    }

   
    @CompileDynamic
    def update() {
        String id = params.id as String
        Pedido pedido = Pedido.get(id)
        def envioOrigen = pedido.envio
        bindData pedido, getObjectToBind()
        if(pedido.envio) {
            if(!pedido.envio.pedido) {
                pedido.envio.pedido = pedido
            }
        }
        pedido = pedidoService.save(pedido)
        if(pedido.envio == null && envioOrigen) {
            envioOrigen.delete flush: true // Hack por que el envio no se elimina de manera automárica.
        }
        respond pedido, view: 'show'
    }
   

    @Override
    protected Pedido saveResource(Pedido resource) {
        return pedidoService.save(resource)
    }

    @Override
    protected Pedido updateResource(Pedido resource) {
        return pedidoService.save(resource)
    }

    /**
     * Elimina la requisicion
     *
     * @param resource
     */
    @Override
    protected void deleteResource(Pedido resource) {
        pedidoService.delete(resource)
    }

    def cerrar(Pedido pedido) {
        if(pedido == null) {
            notFound()
            return
        }
        pedido = pedidoService.cerrar(pedido)
        respond pedido
    }

    def autorizar(Pedido pedido) {
        if(pedido == null) {
            notFound()
            return
        }
        String comentario = params.comentario
        String usuario = params.usuario
        pedido = pedidoService.autorizar(pedido, usuario, comentario)
        respond pedido
    }

    def print(Pedido pedido ) {
        if(pedido == null){
            notFound()
            return
        }
        Map repParams = [id: pedido.id]
        repParams.IMP_CON_LETRA = ImporteALetra.aLetra(pedido.total)
        def pdf =  reportService.run('Pedido.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Pedido.pdf')
    }

    def findByFolio() {
        // log.info('findByFolio {}', params)
        def pedido =  Pedido.where{folio == params.getLong('folio')}.
            where{ formaDePago =~ 'DEPOSITO%' || formaDePago == 'TRANSFERENCIA'}
            .find()

        if(pedido == null){
            notFound()
            return
        }
        respond pedido
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
