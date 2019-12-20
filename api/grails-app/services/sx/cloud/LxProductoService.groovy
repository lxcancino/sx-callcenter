package sx.cloud

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic

import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.Query
import com.google.firebase.cloud.FirestoreClient
import com.google.api.core.ApiFuture



import sx.core.LogUser
import sx.core.FolioLog


@Slf4j
@GrailsCompileStatic
class LxProductoService {

    LxProducto save(LxProducto producto) {

        def db = FirestoreClient.getFirestore()

    	ApiFuture<WriteResult> future = db.collections('productos')
        .document(producto.id)
        .set(producto)
        
        log.info('Product updated: {}', future.get().getUpdateTime())
        return producto
    }


    
}
