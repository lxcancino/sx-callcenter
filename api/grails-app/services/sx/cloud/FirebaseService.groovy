package sx.cloud

import javax.annotation.Nullable
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

import groovy.transform.CompileDynamic
import groovy.transform.ToString
import groovy.util.logging.Slf4j

import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentChange
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.FirestoreException
import com.google.cloud.firestore.WriteResult
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.*
import com.google.auth.oauth2.GoogleCredentials
import com.google.api.core.ApiFuture


import org.apache.commons.lang3.exception.ExceptionUtils

import grails.compiler.GrailsCompileStatic

@Slf4j
@CompileDynamic
class FirebaseService {

    // static lazyInit = false
    
    private FirebaseApp app

	// @PostConstruct
    void initFirebase() {
        log.debug('Initializing Firebase connection....')
		FirebaseOptions options = new FirebaseOptions.Builder()
  		.setCredentials(GoogleCredentials.getApplicationDefault())
  		.setDatabaseUrl("https://siipapx-436ce.firebaseio.com")
  		.build();

		app = FirebaseApp.initializeApp(options);
		log.info('Connected to Firebase App: {}', app.name)

    }

    void deleteDocumet(DocumentReference docRef) {
         ApiFuture<WriteResult> result = docRef.delete()
         def updateTime = result.get().getUpdateTime().toDate().format('dd/MM/yyyy')
        log.debug('{} DELETED at : {}', docRef.id, updateTime)
    }
   

    Firestore getFirestore() {
        if(!this.app) {
            initFirebase()
        }
        return FirestoreClient.getFirestore()
    }


    FirebaseApp getFirebaseApp() {
        return this.app
    }

	
}


