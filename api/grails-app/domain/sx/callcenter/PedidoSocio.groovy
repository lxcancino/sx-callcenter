package sx.callcenter

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Socio

@ToString(includes = 'pedido, socio', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes = 'id, pedido, socio')
class PedidoSocio {

    String id 
    Socio socio

    static belongsTo = [pedido: Pedido]

    static constraints = {}
    
     static mapping = {
        id generator:'uuid'
    }
}



