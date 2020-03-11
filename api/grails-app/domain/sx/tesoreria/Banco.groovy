package sx.tesoreria

import sx.sat.BancoSat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.EqualsAndHashCode

@Resource(readOnly = false, formats = ['json'], uri = "/api/bancos")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='nombre')
class Banco {

	String id

	String nombre

	BancoSat bancoSat

    Boolean nacional = true

    Long sw2

    static constraints = {
    	nombre unique: true
    	bancoSat nullable: true
        sw2 nullable: true
        nacional nullable:true
    }
    

    String toString(){
        return nombre
    }

    static mapping={
        id generator:'uuid'
    }
}
