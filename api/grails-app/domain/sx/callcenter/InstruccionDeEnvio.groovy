package sx.callcenter

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.ClienteDireccion
import sx.core.Transporte

@EqualsAndHashCode(includes='nombre')
@ToString(includeNames=true,includePackage=false)
class InstruccionDeEnvio {

    String id
    String tipo 
    ClienteDireccion direccion
    Transporte transporte
    Pedido pedido
    
    String telefono
    String contacto
    String horario
    String comentario
    

    static constraints = {
        tipo inList: ['ENVIO', 'FORANEO', 'OCURRE', 'ENVIO_CARGO']
        transporte nullable: true
    }

    static belongsTo = [pedido: Pedido]


    static mapping= {
        id generator: 'uuid'
    }
}
