package sx.firebase

import com.google.cloud.firestore.DocumentChange
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.EventListener
import com.google.cloud.firestore.FirestoreException
import com.google.cloud.firestore.QueryDocumentSnapshot
import com.google.cloud.firestore.QuerySnapshot
import com.google.cloud.firestore.ListenerRegistration 
import groovy.transform.ToString
import groovy.util.logging.Slf4j

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions

import com.google.firebase.cloud.*

import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.Query

import static com.google.cloud.firestore.DocumentChange.Type.*

import org.apache.commons.lang3.exception.ExceptionUtils

import javax.annotation.Nullable

import org.springframework.stereotype.Component
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

@Slf4j
@ToString(includeFields = true)
@Component
class FirebaseSdk {

	@PostConstruct
    void doLog() {
        log.info("Inicializando FireBase en PostConstruct")
        init()
        registerFirestoreListeners()
    }

    @PreDestroy
    void closeSession() {
    	if(registration) {
    		registration.remove();
    	}
    	log.ifo('Clossing Firebase session.....');
    	println 'CLOSE FIREBASE............'
    }

    def init() {
    	// FileInputStream serviceAccount = new FileInputStream("/Users/rubencancino/Desktop/firebase/siipapx-436ce-firebase-adminsdk-ci4eg-779346f0c5.json");

		FirebaseOptions options = new FirebaseOptions.Builder()
  		.setCredentials(GoogleCredentials.getApplicationDefault())
  		.setDatabaseUrl("https://siipapx-436ce.firebaseio.com")
  		.build();

		def app = FirebaseApp.initializeApp(options);
		log.info('Firebase APP: ', app)

    }
    /*
    def registerFirestoreListeners() {
    	DatabaseReference ref = FirebaseDatabase.getInstance()
    	.getReference("/depositos");
    	log.info('Database referencia: {}', ref)
    	ref.addValueEventListener(new ValueEventListener() {
  			@Override
  			public void onDataChange(DataSnapshot dataSnapshot) {
    			Object document = dataSnapshot.getValue();
    			log.info('Data changed: {}', document)
  			}

  			@Override
  			public void onCancelled(DatabaseError error) {
  				System.out.println("The read failed: " + databaseError.getCode());
  			}
		});
    }
    */
     def registerFirestoreListeners2() {
     	def db = FirestoreClient.getFirestore()
     	// log.info('FireStore: {}', db)
     	
     	Query query = db.collection("depositos").get()
     	// log.info('Depositos collection : {}', query)
     	def querySnapshot = query.get();
     	List documents = querySnapshot.getDocuments();
     	documents.each { docRef ->
     		log.info("Id: {} {}" , docRef.getId(), docRef.getString('nombre'));
     	}
		query.addSnapshotListener(new EventListener<QuerySnapshot>() {

			@Override
			void onEvent(@Nullable QuerySnapshot value, @Nullable FirestoreException error) {

			}
		})

     }

	def registerFirestoreListeners3() {
		def db = FirestoreClient.getFirestore()
		// log.info('FireStore: {}', db)

		db.collection("depositos")
				.addSnapshotListener(new EventListener<QuerySnapshot>() {
			@Override
			void onEvent(
					@Nullable QuerySnapshot snapshots,
					@Nullable FirestoreException ex) {
				if(ex) {
					String msg = ExceptionUtils.getRootCauseMessage(ex)
					log.error("Error: {}", msg, ex)
				}
				snapshots.each { DocumentSnapshot doc ->
					log.info("Change type: {} Data: {}",doc.id, doc.data)
				}
			}
		})

	}

	ListenerRegistration registration

	def registerFirestoreListeners() {
		Firestore db = FirestoreClient.getFirestore()

		registration = db.collection("depositos")
				.addSnapshotListener(new EventListener<QuerySnapshot>() {
			@Override
			void onEvent(
					@Nullable QuerySnapshot snapshots,
					@Nullable FirestoreException ex) {
				if(ex) {
					String msg = ExceptionUtils.getRootCauseMessage(ex)
					log.error("Error: {}", msg, ex)
				}
				snapshots.getDocumentChanges().each { DocumentChange dc ->
					logEvent(dc)
					switch (dc.type) {
						case ADDED:
							log.info('NO HACER NADA PARA EL DEPOSITO: {} ', dc.document.id)
							break
						case MODIFIED:
							if(dc.document.get('autorizacion')) {
								log.info('GENERAR COBRO PARA DEPOSITO: {} ', dc.document.id)
							} else {
								log.info('REGRESA A CALL CENTER RESPUESTA: {}', dc.document.get('respuesta'))
							}
							break
						case REMOVED:
							log.info('NO HACER NADA')
							break
					}

				}
			}
		})

	}

	private void logEvent(DocumentChange dc) {
		QueryDocumentSnapshot doc = dc.getDocument()
		String id = doc.id
		def status = doc.get('autorizacion') ? 'AUTORIZADO' : 'PENDIENTE'
		log.info('Deposito {} N: {}  TOTAL: {} STATUS: {}', dc.getType(), doc.get('nombre'), doc.get('total'), status, id)
	}
}


