package sx.callcenter

import grails.web.databinding.WebDataBinding
import org.grails.datastore.gorm.GormValidateable

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

@ToString(includeNames=true, includePackage=false)
@EqualsAndHashCode(includes='id, sucursal, tipo, descripcion')
class PedidoAutorizacion {

    String sucursal

    String tags

    String comentario

    String solicita

    String autoriza

    Date dateCreated
    

    static constraints = {}

    Map toFirebaseMap() {
        Map data = this.properties
        data = data.findAll{ k, v -> k != 'class'}
        return data
    }

}
