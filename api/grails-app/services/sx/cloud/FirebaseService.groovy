package sx.cloud

import javax.annotation.Nullable
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

import groovy.transform.CompileDynamic
import groovy.transform.ToString
import groovy.util.logging.Slf4j

import org.springframework.beans.factory.annotation.Value

import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentChange
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.SetOptions
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

    static lazyInit = false

    @Value('${siipapx.firebase.projectId}')
    String projectId

    @Value('${siipapx.firebase.url}')
    String firebaseUrl

    @Value('${siipapx.firebase.bucket}')
    String firebaseBucket
    
    private FirebaseApp app

	// @PostConstruct
    void initFirebase() {
        log.debug('Initializing Firebase connection....')
		FirebaseOptions options = new FirebaseOptions.Builder()
  		.setCredentials(GoogleCredentials.getApplicationDefault())
      .setProjectId(this.projectId)
  		.setDatabaseUrl(this.firebaseUrl)
      .setStorageBucket(this.firebaseBucket)
  		.build();

		app = FirebaseApp.initializeApp(options);
		log.info('Connected to Firebase App: {}', app.name)
    }
    
    void addDocument(String collection, Map data) {
      ApiFuture<DocumentReference> future = getFirestore()
          .collection(collection)
          .add(data)
      DocumentReference docRef = future.get()
      log.debug('Document added: {}', docRef.id)
    }

    void updateDocument(String docPath,  Map changes) {
        
      ApiFuture<WriteResult> result = getFirestore()
      .document(docPath)
      .set(changes, SetOptions.merge())
      def updateTime = result.get()
          .getUpdateTime()
          .toDate()
          .format('dd/MM/yyyy')
      log.debug('{} UPDATED at : {}',  docPath, updateTime)
    }

    
    void deleteDocumet(DocumentReference docRef) {
         ApiFuture<WriteResult> result = docRef.delete()
         def updateTime = result.get().getUpdateTime().toDate().format('dd/MM/yyyy')
        log.debug('{} DELETED at : {}', docRef.id, updateTime)
    }

    DocumentReference findDocument(String path) {
      return getFirestore().document(path)
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


