package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import grails.web.databinding.WebDataBinding

import sx.core.Producto

@ToString(includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'id, clave, unidad')
class LxProducto implements WebDataBinding{

    String id
    String clave
    String descripcion
    String descripcionLarga
    String unidad
    String precioContado
    String precioCredito
    boolean activo
    String	modoVenta
    String presentacion
    double kilos
    double gramos
    double calibre
    String color
    boolean nacional
    double ancho
    double largo
    double m2XMillar 
    boolean inventariable

    String linea
    String marca
    String clase
    String imageUrl

    Date dateCreated
    Date lastUpdated

    String claveSat
    String unidadSat

    Set<LxExistencia> existencias
    double disponible

    LxProducto(Producto prod) {
        this.properties = prod.properties
    }

}

class LxExistencia {
    String almacen
    double cantidad
    double apartado
    double disponible
}