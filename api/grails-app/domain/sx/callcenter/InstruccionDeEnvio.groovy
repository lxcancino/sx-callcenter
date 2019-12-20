package sx.callcenter

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Direccion
import sx.core.Transporte

@EqualsAndHashCode(includes='nombre')
@ToString(includeNames=true,includePackage=false)
class InstruccionDeEnvio {

    String id
    String tipo 
    Direccion direccion
    Transporte transporte
    
    // Pedido pedido
    
    String telefono
    String contacto
    String horario
    String comentario

    static embedded = ['direccion']
    

    static constraints = {
        tipo inList: ['ENVIO', 'FORANEO', 'OCURRE', 'ENVIO_CARGO']
        transporte nullable: true
        telefono nullable: true
        contacto nullable: true
        horario nullable: true
        comentario nullable: true
    }

    static belongsTo = [pedido: Pedido]


    static mapping= {
        id generator: 'uuid'
    }
}
