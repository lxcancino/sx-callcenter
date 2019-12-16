package sx.core

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='nombre')
@ToString(includeNames=true,includePackage=false)
class Transporte {

    String id
    String nombre
    Direccion direccion

    static constraints = {
    }

    static embedded = ['direccion']

    static mapping= {
        id generator: 'uuid'
    }
}
