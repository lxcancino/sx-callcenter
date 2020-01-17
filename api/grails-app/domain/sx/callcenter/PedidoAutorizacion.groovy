package sx.callcenter

import grails.web.databinding.WebDataBinding
import org.grails.datastore.gorm.GormValidateable

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

@ToString(includeNames=true, includePackage=false)
@EqualsAndHashCode(includes='id, sucursal, tipo, descripcion')
class PedidoAutorizacion {

    String sucursal

    String tipo

    String description

    String status

    String comentario

    String solicita

    String autorizo

    Date fechaDeAutorizacion

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    static constraints = {
        comentario nullable: true
        createUser nullable: true
        updateUser nullable: true
    }

    Map toFirebaseMap() {
        Map data = this.properties
        data = data.findAll{ k, v -> k != 'class'}
        return data
    }

}
