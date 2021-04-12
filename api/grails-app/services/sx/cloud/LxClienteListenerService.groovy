package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import javax.annotation.Nullable

import groovy.util.logging.Slf4j

import org.springframework.stereotype.Component
import  org.springframework.beans.factory.InitializingBean

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


import sx.core.Cliente
import sx.core.ClienteCredito


@Slf4j
// @GrailsCompileStatic
class LxClienteListenerService implements EventListener<QuerySnapshot> {

	static lazyInit = Environment.isDevelopmentMode() ? true : false

	FirebaseService firebaseService

	final static String COLLECTION = 'clientes'

	ListenerRegistration registration

	@PostConstruct
	def start() {
		log.debug('Registering listener to firebase collection: {}', COLLECTION)
		Firestore db = firebaseService.getFirestore()
		registration = db.collection(COLLECTION)
		.limit(10) // Temporal
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

	void onEvent(@Nullable QuerySnapshot snapshots, @Nullable FirestoreException ex) {
		if(ex) {
			String msg = ExceptionUtils.getRootCauseMessage(ex)
			log.error("Error: {}", msg, ex)
		}
		snapshots.getDocumentChanges().each{ DocumentChange dc
			QueryDocumentSnapshot document = dc.document
			log.debug('Document change: ({}) {}  Nom: {}', dc.type, document.id, document.data.nombre)
			switch (dc.type) {
				case ADDED:
				case MODIFIED:
					// updateCliente(document.id, document.data)
					break
				case REMOVED:
					break
			}
		}
	}

	@Transactional()
	void updateCliente(String id, Map data) {
		log.debug('Actualizando cliente {} con Data: {}', id, data)
		try {
			Cliente target = Cliente.get(id)
			Map filteredData = [:]
			bindData(filteredData, data, excludes: ['clave'])
			
			target.properties = data
			target.validate()
			if(target.hasErrors()) {
				log.error('Validation errors: {}', target.errors)
				throw new Exception('Datos incorrectos para actualizar el cliente ' + target.errors)
			}
			target.save failOnError: true, flush: true	
			log.debug('Cliente {} actualizado exitosamente', target.nombre)
		} catch (Exception ex) {
			log.error('Exception: {}', ex.message)
			
		}

	}

	
}


