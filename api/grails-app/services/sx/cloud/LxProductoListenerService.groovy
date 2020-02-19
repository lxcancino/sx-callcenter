package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import javax.annotation.Nullable

import groovy.util.logging.Slf4j

import org.springframework.stereotype.Component

import grails.compiler.GrailsCompileStatic
import grails.web.databinding.DataBinder
import grails.gorm.transactions.Transactional
import grails.util.Environment

import org.apache.commons.lang3.exception.ExceptionUtils

import com.google.cloud.firestore.*
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.*
import com.google.firebase.cloud.*
import static com.google.cloud.firestore.DocumentChange.Type.*

import sx.core.Producto
import sx.core.Linea
import sx.core.Marca
import sx.core.Clase


@Slf4j
// @GrailsCompileStatic
class LxProductoListenerService implements DataBinder, EventListener<QuerySnapshot> {

	static lazyInit = false

	FirebaseService firebaseService

	final static String COLLECTION = 'productos'

	ListenerRegistration registration

	@PostConstruct
	def start() {
		if (Environment.current == Environment.PRODUCTION) { 	
			log.info('Registering listener to firebase collection: {}', COLLECTION)
			Firestore db = firebaseService.getFirestore()
			registration = db.collection(COLLECTION)
			.addSnapshotListener(this)
			log.info('Listening to firestore collection: {}', COLLECTION)
		}
	}

	@PreDestroy
	def stop() {
		if(registration) {
			registration.remove()
			log.info('Firbase listener for collection: {} removed' , COLLECTION)
		}
	}

	@Transactional()
	void updateProducto(String id, Map data) {
		log.debug('Actualizando producto {} con Data: {}', id, data)
		try {
			Producto target = Producto.get(id)
			Map filteredData = [:]
			bindData(filteredData, data, excludes: ['proveedorFavorito'])
			
			target.properties = data
			target.validate()
			if(target.hasErrors()) {
				log.error('Validation errors: {}', target.errors)
				throw new Exception('Datos incorrectos para actualizar el producto')
			}
			target.save failOnError: true, flush: true	
			log.debug('Producto {} actualizado exitosamente', target.clave)
		} catch (Exception ex) {
			log.error('Exception: {}', ex.message)
			
		}

	}

	private void logEvent(DocumentChange dc) {
		QueryDocumentSnapshot doc = dc.getDocument()
		String id = doc.id
	}

	void onEvent(@Nullable QuerySnapshot snapshots, @Nullable FirestoreException ex) {
		if(ex) {
			String msg = ExceptionUtils.getRootCauseMessage(ex)
			log.error("Error: {}", msg, ex)
		}
		
		if(snapshots.getDocumentChanges().size() == 1) {
			DocumentChange dc = snapshots.getDocumentChanges()[0]
			log.debug('Document change: {}', dc)
			QueryDocumentSnapshot document = dc.document
			switch (dc.type) {
				case ADDED:
				case MODIFIED:
					updateProducto(document.id, document.data)
					break
				case REMOVED:
					break
			}
		}
	}
}


