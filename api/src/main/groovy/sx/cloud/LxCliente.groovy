package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Direccion
import sx.core.Cliente

@ToString(includeNames=true, includePackage=false)
@EqualsAndHashCode(includes='nombre')
class LxCliente {

    String id
    String clave
    String nombre
    String rfc
    String email

    Long folioRFC = 1
    
    Boolean activo = true
    Boolean permiteCheque = false
    Double chequeDevuelto = 0
    Boolean juridico = false
    
    
    Direccion direccion

    List medios = []

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser
    

    public LxCliente() {}

    public LxCliente(Cliente cliente) {
        this.id = cliente.id
        this.nombre = cliente.nombre
        this.rfc = cliente.rfc
        this.email = cliente.getCfdiMail() 
        this.activo = cliente.activo
    }

    

}
