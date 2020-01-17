package sx.callcenter

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic


import sx.core.LogUser
import sx.core.FolioLog
import sx.cloud.FirebaseService

@Slf4j
@Transactional
// @GrailsCompileStatic
class PedidoService implements FolioLog {

    FirebaseService firebaseService

    Pedido save(Pedido pedido) {
    	log.debug("Salvando pedido {}", pedido)
        if(!pedido.id )
            pedido.folio = nextFolio('PEDIDO', 'CALLCENTER')
        // logEntity(pedido)
        if(pedido.envio) {
            log.info('Envio: {}' , pedido.envio) // Hack para salvar correctamente el envio *** ???
            pedido.envio.pedido = pedido
        }
        actualizarKilos(pedido)
        pedido.save failOnError: true, flush: true
        return pedido
    }

    void actualizarKilos(Pedido pedido) {
        def kilos = pedido.partidas.sum { det ->
            def factor = det.producto.unidad == 'MIL' ? 1000 : 1
            def kg = (det.cantidad / factor) * det.producto.kilos
            return kg
        }
        pedido.kilos = kilos
    }

    Pedido cerrar(Pedido pedido) {
        pedido.status = 'CERRADO'
        pedido.cerrado = new Date()
        return save(pedido)
    }

    void delete(Pedido pedido) {
    	pedido.delete flush: true
    }

    def publishToFirebase(pedido Pedido) {
        if(pedido.cerrado) {
            def docRef = firebaseService
            .getFirestore()
            .collection('pedidos')
            .add()
        }

    }
}
