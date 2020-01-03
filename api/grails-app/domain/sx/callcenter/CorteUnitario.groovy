package sx.callcenter

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Direccion
import sx.core.Transporte

@EqualsAndHashCode(includes='id')
@ToString(includeNames=true,includePackage=false)
class CorteUnitario {

    String id

    double tantos
    String instruccion
    int cantidad
    double precio
    double importe
    boolean refinado


    static constraints = {
        cantidad minSize: 1
    }

    static mapping= {
        id generator: 'uuid'
    }
}
