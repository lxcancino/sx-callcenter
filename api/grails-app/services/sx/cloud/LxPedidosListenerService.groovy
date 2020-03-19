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
class LxPedidosListenerService implements EventListener<QuerySnapshot> {
	
	static lazyInit = false

	FirebaseService firebaseService

	final static String COLLECTION = 'pedidos'

	ListenerRegistration registration

	LxPedidoLogService lxPedidoLogService

	@PostConstruct
	def start() {
		log.info('Registering listener to firebase collection: {}', COLLECTION)
		Firestore db = firebaseService.getFirestore()
		registration = db.collection(COLLECTION)
		.whereEqualTo('status', 'COTIZACION')
		.addSnapshotListener(this)
		log.info('Listening to firestore collection: {}', COLLECTION)
	}

	@PreDestroy
	def stop() {
		if(registration) {
			registration.remove()
			log.info('Firbase listener for collection: {} removed' , COLLECTION)
		}
	}

	@Transactional()
	void updatePedido(String id, QueryDocumentSnapshot document) {
		Pedido pedido = Pedido.get(id)
		pedido.status = 'COTIZACION'
		pedido.save failOnError: true, flush: true
		log.debug('Status de pedido: {} actualizado a: {}', pedido.folio, pedido.status)
		firebaseService.deleteDocumet(document.getReference())
		lxPedidoLogService.updateLog(pedido.id, [status: 'COTIZACION', cerrado: null])
		
	}

	void onEvent(@Nullable QuerySnapshot snapshots, @Nullable FirestoreException ex) {
		if(ex) {
			String msg = ExceptionUtils.getRootCauseMessage(ex)
			log.error("Error: {}", msg, ex)
		}
		snapshots.getDocumentChanges().each { DocumentChange dc ->
			
			QueryDocumentSnapshot document = dc.document
			log.debug('Document change: ({}){} Pedido: {} ', dc.type, document.id, document.data.folio)
			// updatePedido(document.id, document)
			switch (dc.type) {
				case ADDED:
					updatePedido(document.id, document)
					break
				case MODIFIED:
					// log.debug('MODIFIED....')
					break
				case REMOVED:
					// log.debug('REMOVED....')
					break
			}
			
		}
	}
}


