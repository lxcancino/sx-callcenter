package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import java.sql.SQLException


import groovy.util.logging.Slf4j


import grails.util.Environment
import org.springframework.scheduling.annotation.Scheduled

import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.Query
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.CollectionReference
import com.google.api.core.ApiFuture

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.AppConfig
import sx.core.LogUser
import sx.core.FolioLog
import sx.core.Producto
import sx.core.Existencia
import sx.core.Sucursal
import sx.utils.Periodo


/**
* Este bean es de prueba en el call center no se ocupa
**/
@Slf4j
class LxExistenciaService {


    FirebaseService firebaseService

    def dataSource

    static String TIME_FORMAT = 'dd/MM/yyyy HH:mm'

    static String ENTITY = 'CloudExis'

    def publishAll() {
        Date start = new Date()
        Sucursal sucursal = AppConfig.first().sucursal
        def ejercicio = Periodo.obtenerYear(new Date())
        def mes = Periodo.obtenerMes(new Date()) + 1
        def select = """
            select 
                e.sucursal_nombre as almacen, 
                e.anio as ejercicio, 
                e.mes as mes, 
                p.clave, 
                p.descripcion, 
                CAST(e.cantidad AS UNSIGNED)as cantidad,
                CAST(e.recorte AS UNSIGNED)as recorte, 
                recorte_comentario as recorteComentario
            from existencia e
            join producto p on (e.producto_id = p.id)
            where e.sucursal_id = :sucursal
            and e.anio = :ejercicio  
            and e.mes = :mes
            and p.activo = true
            order by p.clave 
            limit 2
        """
        List<Map> rows = getRows(select, ['ejercicio': ejercicio, 'mes': mes, 'sucursal': sucursal.id])
        
        int updates = 0
        
        rows.each { row ->
            row.ejercicio = row.ejercicio as Integer
            row.mes = row.mes as Integer
            row.cantidad = row.cantidad.toLong()
            row.recorte = row.recorte.toLong()
            log.info('Exis: {}', row)
            
            try {
                publish(row.clave, row)
            }catch (Exception ex) {
                def c = ExceptionUtils.getRootCause(ex)
                def message = ExceptionUtils.getRootCauseMessage(ex)
                log.error('Error: {}', message)
            }
            
            updates++
            
        }
        logChange(sucursal.nombre, 'PUBLISH_ALL', start)
        return updates
    }


    def publish(String clave, Map<String, Object> data) {
        
        DocumentReference docRef = firebaseService.getFirestore()
            .collection('existencias')
            .document(clave)

        DocumentSnapshot snapShot = docRef.get().get()

        ApiFuture<WriteResult> result = null
        
        if (!snapShot.exists()) {
            log.debug('No hay existencia GLOBAL para: {}', clave)
            Map exis = [clave: clave, descripcion: data.descripcion]
            docRef.set(exis)
            result = docRef
                .collection('almacenes')
                .document(data.almacen)
                .set(data)
        } else {
            log.debug('Actualizando existencia de {} en almancen: {}', clave, data.almacen)
            result = docRef
                .collection('almacenes')
                .document(data.almacen)
                .set(data)
            // return null
        }
        def updateTime = result.get().getUpdateTime()
        log.debug("Publish time : {} " , updateTime)
        return updateTime
    }
    

}
