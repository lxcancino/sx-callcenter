package sx.callcenter

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic


import sx.core.LogUser
import sx.core.FolioLog

@Slf4j
@Transactional
@GrailsCompileStatic
class PedidoService implements FolioLog{

    Pedido save(Pedido pedido) {
    	log.debug("Salvando pedido {}", pedido)
        if(!pedido.id )
            pedido.folio = nextFolio('PEDIDO', 'CALLCENTER')
        // logEntity(pedido)
        if(pedido.envio) {
            log.info('Envio: {}' , pedido.envio) // Hack para salvar correctamente el envio *** ???
            pedido.envio.pedido = pedido
        }
        pedido.save failOnError: true, flush: true
        return pedido
    }

    Pedido cerrar(Pedido pedido) {
        pedido.status = 'CERRADO'
        pedido.cerrado = new Date()
        return save(pedido)
    }

    void delete(Pedido pedido) {
    	pedido.delete flush: true
    }
}
