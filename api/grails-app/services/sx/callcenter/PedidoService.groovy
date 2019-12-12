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
        pedido.save failOnError: true, flush: true
        return pedido
    }

    void delete(Pedido pedido) {
    	pedido.delete flush: true
    }
}