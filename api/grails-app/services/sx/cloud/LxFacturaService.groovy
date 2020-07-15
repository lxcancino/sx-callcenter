package sx.cloud

import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import com.google.cloud.storage.BlobId
import com.google.cloud.storage.BlobInfo

import sx.cloud.FirebaseService
import sx.callcenter.Pedido

@Slf4j
class LxFacturaService {

    FirebaseService firebaseService
    

    def enviarFactura(Pedido Pedido) {

        String projectId = firebaseService.projectId 
        String bucketName = firebaseService.firebaseBucket
        Storage storage = StorageOptions.newBuilder()
            .setProjectId(projectId)
            .build()
            .getService()

        BlobId blobId = BlobId.of(bucketName, objectName)
        

        storage.create(blobInfo,data)
        log.info('Documento {} publicada EXITOSAMENTE en firebase', objectName)
    }

    


    



}
