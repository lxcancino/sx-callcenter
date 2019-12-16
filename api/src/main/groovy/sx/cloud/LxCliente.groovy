package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Direccion

@ToString(includeNames=true, includePackage=false)
@EqualsAndHashCode(includes='nombre')
class Cliente {

    String id
    String nombre
    String rfc
    String clave
    Boolean activo = true
    String email
    Boolean permiteCheque = false
    Double chequeDevuelto = 0
    Boolean juridico = false

    Long folioRFC = 1
    
    Direccion direccion

    List medios = []

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser
    

    

}
