package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Producto

@ToString(includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'id, clave, unidad')
class LxProducto {

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
    BigDecimal kilos
    BigDecimal gramos
    BigDecimal calibre
    String color
    boolean nacional
    BigDecimal ancho
    BigDecimal largo
    BigDecimal m2XMillar 
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
        this.properties
    }

}

class LxExistencia {
    String almacen
    double cantidad
    double apartado
    double disponible
}