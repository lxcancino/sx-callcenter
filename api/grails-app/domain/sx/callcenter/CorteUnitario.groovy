package sx.callcenter

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='id')
@ToString(includeNames=true, includePackage=false)
class CorteUnitario {

    String id
    Integer tantos
    String instruccion
    int cantidad
    double precio
    double importe
    boolean refinado

    // static belongsTo = [pedidoDet: PedidoDet]

    static constraints = {
        tantos nullable: true
        cantidad minSize: 1
    }

    static mapping= {
        id generator: 'uuid'
    }
}
