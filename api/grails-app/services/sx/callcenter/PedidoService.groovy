package sx.callcenter

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic


import sx.core.LogUser
import sx.core.FolioLog
import sx.cloud.LxPedidoService

@Slf4j
@Transactional
// @GrailsCompileStatic
class PedidoService implements FolioLog {

    LxPedidoService lxPedidoService

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
        // registrarAutorizaciones(pedido)
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
    /*
    void registrarAutorizaciones(Pedido pedido) {
        if(pedido.descuentoEspecial > 0) {
            if(!pedido.autorizacion) {
                pedido.autorizacion = new PedidoAutorizacion(
                        sucursal: 'CALLCENTER',
                        tipo: 'DESCUENTO_ESPECIAL',
                        descripcion: 'Pedido con descuento especial',
                        solicita: pedido.updateUser,
                        comentario: 'Pedido especial',
                        status: 'PENDIENTE'
                    )
            }
        }
    }
    */

    Pedido cerrar(Pedido pedido) {
        pedido.status = 'CERRADO'
        pedido.cerrado = new Date()
        pedido = save(pedido)
        lxPedidoService.push(pedido)
        return pedido
    }

    Pedido autorizar(Pedido pedido, String usuario, String comentario) {
        log.info('Autorizando pedido: {} User: {} Comentario:{}', pedido.folio, usuario, comentario)
        def auth = pedido.autorizacion
        auth.status = 'AUTORIZADO'
        auth.autorizo = usuario
        auth.autorizado = new Date()
        auth.comentario = comentario
        pedido = save(pedido)
        lxPedidoService.push(pedido)
        return pedido
    }

    void delete(Pedido pedido) {
    	pedido.delete flush: true
    }

    def publishToFirebase(Pedido pedido) {
        if(pedido.cerrado) {
            def docRef = firebaseService
            .getFirestore()
            .collection('pedidos')
            .document(pedido.id)
            .set(pedido)
        }

    }
}
