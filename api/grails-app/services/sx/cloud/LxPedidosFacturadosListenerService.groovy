package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import javax.annotation.Nullable

import groovy.util.logging.Slf4j

import org.springframework.stereotype.Component

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.util.Environment

import org.apache.commons.lang3.exception.ExceptionUtils

import com.google.cloud.firestore.*
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.*
import com.google.firebase.cloud.*

import static com.google.cloud.firestore.DocumentChange.Type.*

import sx.callcenter.Pedido



@Slf4j
// @GrailsCompileStatic
class LxPedidosFacturadosListenerService implements EventListener<QuerySnapshot> {
  
  static lazyInit = false

  FirebaseService firebaseService

  final static String COLLECTION = 'pedidos'

  ListenerRegistration registration

  LxPedidoLogService lxPedidoLogService

  @PostConstruct
  def start() {
    log.info('Monitoreando PEDIDOS FACTURADOS activado')
    Firestore db = firebaseService.getFirestore()
    registration = db.collection(COLLECTION)
    .whereIn("status", Arrays.asList("FACTURADO_TIMBRADO"))
    .limit(2000)
    .addSnapshotListener(this)
  }

  @PreDestroy
  def stop() {
    if(registration) {
      registration.remove()
      log.info('Monitoreo de pedidos factirados terminado')
    }
  }

  @Transactional()
  void updatePedido(String id, Map data) {
    log.info('Actualizando pedido Folio: {} Id: {}', data.folio, id)
    
    /// log.info('Data: {}', data.facturacion)
    Pedido pedido = Pedido.get(id)
    if(pedido) {
      
      pedido.status = data.status
      def factura = data.facturacion
      if(factura) {
        def cfdi = factura.cfdi
        log.info('Factura: {}-{} UUID:{}', factura.serie, factura.folio, cfdi ? cfdi.uuid : 'ND')
        pedido.facturaSerie = data.facturacion.serie
        pedido.facturaFolio = data.facturacion.folio
        if(data.facturacion.cfdi) {
          pedido.uuid = data.facturacion.cfdi.uuid  
        }
      }
      try {
        pedido.save failOnError: true, flush: true
        log.debug('Pedido: {} actualizado a: {}', pedido.folio, pedido.status)
      }catch (Exception ex){
        log.info('Error: {}', ex.message)
      }
      
    }
    

    ///if(pedido == null)
      ///return
    
    

    
    
  }

  void onEvent(@Nullable QuerySnapshot snapshots, @Nullable FirestoreException ex) {
    if(ex) {
      String msg = ExceptionUtils.getRootCauseMessage(ex)
      log.error("Error: {}", msg, ex)
    }
    snapshots.getDocumentChanges().each { DocumentChange dc ->
      
      QueryDocumentSnapshot document = dc.document
      Map data = document.data
      // log.debug('Pedido {} {} ID: {}', data.folio, dc.type, document.id)
      switch (dc.type) {
        case ADDED:
        case MODIFIED:
          // log.debug('MODIFIED....')
          updatePedido(document.id, data)
          break
        case REMOVED:
          // log.debug('REMOVED....')
          break
      }
      
    }
  }
}


