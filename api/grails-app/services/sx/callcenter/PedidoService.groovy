package sx.callcenter

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic
import groovy.sql.Sql
import java.sql.SQLException

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.LogUser
import sx.core.FolioLog
import sx.cloud.LxPedidoService
import sx.cloud.LxPedidoLogService

@Slf4j
@Transactional
// @GrailsCompileStatic
class PedidoService implements FolioLog {

    LxPedidoService lxPedidoService
    LxPedidoLogService lxPedidoLogService

    def dataSource

    Pedido save(Pedido pedido) {
    	log.debug("Salvando pedido {}", pedido)
        if(!pedido.id )
            pedido.folio = nextFolio('PEDIDO', 'CALLCENTER')
        if(pedido.envio) {
            log.info('Envio: {}' , pedido.envio) // Hack para salvar correctamente el envio *** ???
            pedido.envio.pedido = pedido
        }
        actualizarKilos(pedido)
        pedido = pedido.save(failOnError: true, flush: true)
        logPedido(pedido)
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
        pedido = save(pedido)
        lxPedidoService.push(pedido)
        logPedido(pedido)
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
        logPedido(pedido)
        return pedido
    }

    void delete(Pedido pedido) {
        if(!pedido.cerrado)
    	   pedido.delete flush: true
    }

    void logPedido(Pedido pedido) {
        try {
            if(pedido.cerrado){
                return
            } 
            lxPedidoLogService.publishLog(pedido)
        }catch (Exception ex) {
            String msg = ExceptionUtils.getRootCauseMessage(ex)
            log.error('Error actualizando PedidoLog en Firebase {}', msg)
        }
    }

    void logPedido(String id, Map changes) {
        try {
            if(pedido.cerrado){
                return
            } 
            lxPedidoLogService.publishLog(pedido)
        }catch (Exception ex) {
            String msg = ExceptionUtils.getRootCauseMessage(ex)
            log.error('Error actualizando PedidoLog en Firebase {}', msg)
        }
    }

    String buscarSucursal(String codigoPostal) {
        
        if( codigoPostal && (codigoPostal.size() > 2) ){
            String clave = codigoPostal[0..1]
            def row = findRegistro("select * from zona where cp_ini=?", [codigoPostal[0..1]])
            if(row)
                return row.sucursal   
        }
        return null
        
    }

    def  findRegistro(String sql,List params){
        Sql db = getSql()
        try {
            return db.firstRow(sql, params)
        }catch (SQLException e){
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            logger.error(message,c)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }
     Sql getSql(){
       return new Sql(dataSource)
    }
    
}
