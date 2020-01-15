package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic

import com.google.firebase.cloud.FirestoreClient

import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.Query

import com.google.api.core.ApiFuture



import sx.core.LogUser
import sx.core.FolioLog
import sx.core.Producto
import sx.core.Existencia
import sx.utils.Periodo

@Slf4j
// @GrailsCompileStatic
class LxProductoService {

    private Firestore firestoreDb;

    @PostConstruct
    void startFirestore() {
        log.info("Inicializando FireBase en PostConstruct")
    }


    def push(Producto source) {
        log.info('Pushing {} to de cloud', source.clave)
        LxProducto producto = new LxProducto(source)
        Map data = producto.properties //.removeAll { k, v -> k == 'class'} 
        data = data.findAll{ k, v -> k != 'class'}
        resolveExistencias(data.clave)
        
        // To Firestore
        /*
        def collRef = getFirestore().collection('productos')
        log.info('ColRef: {}', collRef)
        ApiFuture<WriteResult> future = collRef
        .document(producto.clave)
        .set(data)
        log.info('Product updated: {}', future.get().getUpdateTime())
        
        // log.info('Properties: {}', data)
        */
        return producto

    }

    void delete(Producto p) {

    }

	def selectCloudProducts() {
		return Producto.where{activo == true &&  inventariable == true}.list([sort: 'clave', order: 'asc', max: 1])
	}

    def resolveExistencias(String clave) {
        def year = Periodo.obtenerYear(new Date())
        def mes = Periodo.obtenerMes(new Date()) + 1
        log.info('Existencias de {} - {}', year, mes)
    }

    Map resolveData(LxProducto p) {
        return [
            id: p.id, 
            clave: p.clave, 
            descripcion: p.descripcion,
            unidad: p.unidad,
            precioContado: p.precioContado,
            precioCredito: p.precioCredito,
            activo: p.activo,
            modoVenta: p.modoVenta,
            presentacion: p.presentacion,
            kilos: p.kilos,
            gramos: p.gramos,
            calibre: p.calibre,
            color: p.color,
            nacional: p.nacional,
            ancho: p.ancho,
            largo: p.largo,
            m2XMillar: p.m2XMillar ,
            inventariable: p.inventariable
            ]
    }
    /*
    Boolean activo
    String  modoVenta
    String presentacion
    double kilos
    double gramos
    double calibre
    String color
    Boolean nacional
    double ancho
    double largo
    double m2XMillar 
    Boolean inventariable

    String linea
    String marca
    String clase

    String imageUrl
    Date lastUpdated

    String claveSat
    String unidadSat

    double disponible
            ]

    }
    */

    Firestore getFirestore() {
        if(!this.firestoreDb) {
            this.firestoreDb = FirestoreClient.getFirestore()
        }
        return this.firestoreDb
    }

    
}
