package sx.core

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'id, nombre')
@ToString(includeNames=true,includePackage=false)
class ClienteDireccion {

    String id
    String nombre
    Direccion direccion

    static belongsTo = [cliente: Cliente]

    static constraints = {}

    static embedded = ['direccion']

    static mapping= {
        id generator: 'uuid'
    }

    Map toFirebaseMap() {
        return [
        	id: this.id,
        	nombre: this.nombre,
        	direccion: this.direccion.toFirebaseMap()
        ]
    }
    
}
