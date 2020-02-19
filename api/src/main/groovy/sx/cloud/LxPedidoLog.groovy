package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode
import groovy.transform.TupleConstructor

@TupleConstructor()
@ToString(includeNames=true, includePackage=false)
@EqualsAndHashCode(includes = 'folio')
class LxPedidoLog {
    
    // Datos generales
    Long folio
    String nombre
    Date fecha
    String sucursal
    boolean envio
    
    // Inicio
    Date iniciado
    Date creado
    String creadoUser
    Date modificado
    Date modificadoUser

    // Cierre
    Date cerrado
    String cerradoUser

    //Atención en sucursal
    String atiende
    Date facturable
    FacturacionLog facturacionLog

    // Embarque
    EmbarqueLog embarqueLog

}

@ToString(includeNames=true, includePackage=false)
class FacturacionLog {
    String serie
    String folio
    String usuario
    Date creado
    boolean cancelado
    String canceladoComentario
}

@ToString(includeNames=true, includePackage=false)
class EmbarqueLog {
    String chofer
    Date asignacion
    String asigno
    Date salida
    Date arribo
    Date recepcion
}
