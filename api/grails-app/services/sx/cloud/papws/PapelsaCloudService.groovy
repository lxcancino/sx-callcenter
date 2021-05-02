package sx.cloud.papws

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserRecord
import com.google.firebase.cloud.FirestoreClient
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.Message
import com.google.firebase.messaging.Notification
import grails.util.Environment
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Value

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

@Slf4j
// @CompileStatic
// @Grailscom
class PapelsaCloudService {

  private FirebaseApp papelws

  @PostConstruct()
  def init() {
    String dirPath = '.'
    String fileName = 'papx-ws-prod-firebase-sdk.json'
    if(Environment.current == Environment.DEVELOPMENT) {
      dirPath = System.getProperty('user.home') + '/.firebase'
      fileName="papx-ws-dev-firebase-sdk.json"
    }
    File file = new File(dirPath, fileName)
    FileInputStream serviceAccount = new FileInputStream(file)
    log.debug('Inicializando Firebase Credentials: {}', file.path)

    FirebaseOptions options = FirebaseOptions.builder()
    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
    .build()

    this.papelws = FirebaseApp.initializeApp(options, 'papelws')
  }

  FirebaseApp  getFirebaseApp() {
    return this.papelws
  }

  Firestore getFirestore() {
    return FirestoreClient.getFirestore(this.papelws)
  }

  FirebaseAuth getAuth() {
    return FirebaseAuth.getInstance(this.papelws)
  }

  FirebaseMessaging getMessaging() {
    return FirebaseMessaging.getInstance(this.papelws)
  }


  @PreDestroy()
  void close() {
    if(this.papelws) {
      String appName = this.papelws.name
      this.papelws.delete()
      this.papelws = null
      log.debug('Papel firebase ws  {} disconected', appName)
    }
  }
}
