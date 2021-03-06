package sx.core

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(excludes ='id,version',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, serie, folio')
@GrailsCompileStatic
class Folio {

    String id

    String entidad

    String serie

    Long folio = 0

    static constraints = {
        entidad maxSize:30
        serie size:1..20
        folio unique: ['entidad','serie']
    }

    static  mapping={
        id generator:'uuid'
    }

    Long next(){
        folio = folio + 1
        return folio
    }

    String toString(){
        return "$entidad $serie - $folio"
    }

    static Long nextFolio(String entidad, String serie){
        Folio.withTransaction {
            Folio folio = Folio.findOrCreateWhere(entidad: entidad, serie: serie)
            Long res = folio.folio + 1
            folio.folio = res
            folio.save flush: true
            return res
        }
    }

}
