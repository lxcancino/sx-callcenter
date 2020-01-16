package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic

import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.Query
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.api.core.ApiFuture

import sx.core.LogUser
import sx.core.FolioLog
import sx.core.Producto
import sx.core.Existencia
import sx.core.Sucursal
import sx.utils.Periodo

@Slf4j
// @GrailsCompileStatic
class LxProductoService {

    FirebaseService firebaseService

    def push(Producto prod, Map<String, Object> changes = null) {
        DocumentReference docRef = firebaseService
            .getFirestore()
            .collection('productos')
            .document(prod.clave)
        DocumentSnapshot snapShot = docRef.get().get()
        ApiFuture<WriteResult> result = null
        if (snapShot.exists()) {
            if(!changes){
                log.debug('No hay cambios por aplicar {}', prod.clave)
                return prod
            }
            log.info('Actualizando entidad existente changes: {}', changes)
            result = docRef.update(changes)
        } else {
            changes = resolveProperties(prod)
            log.info('Registrando producto nuevo : {}', changes)
            result = docRef.set(changes)
        }
        return prod
        
    }

    void delete(Producto p) {}

    private Map<String, Object> resolveProperties(Producto source) {
        LxProducto producto = new LxProducto(source)
        Map<String, Object> data = producto.properties 
        data = data.findAll{ k, v -> k != 'class'}
        return data
    }

    def resolveExistencias() {
        def year = Periodo.obtenerYear(new Date())
        def mes = Periodo.obtenerMes(new Date()) + 1
        List<Map> result = []
        List<Sucursal> sucursales = Sucursal.where{almacen == true}.list()
        return sucursales.collect{
            [almacen: it.nombre, 'cantidad': 0, 'apartados': 0, 'disponible': 0]
        }
    }

    def selectCloudProducts() {
        return Producto.where{activo == true &&  inventariable == true}.list([sort: 'clave', order: 'asc', max: 3])
    }
    

    

    
}
