package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@GrailsCompileStatic
@Secured("permitAll")
class ZipController  {
    
    ZipController() {}

    def find(String zip) {
        def map = [:]
        def res = CodigosPostalesMx.where{codigo == zip}.list()
        if(res) {
            map.estado = res[0].estado
            map.municipio = res[0].municipio
            map.ciudad = res[0].ciudad
            map.colonias = res.collect {it.colonia}
            map.pais = 'México'
            map.codigoPostal = zip
        }
        respond map
    }
    
}
