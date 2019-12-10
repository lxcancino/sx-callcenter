package sx.callcenter

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Producto

@ToString(includes='clave, descripcion, cantidad, precio, descuentoImporte, subtotal',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'id')
class PedidoDet {

    String id
    // Datos del producto
    Producto producto
    String clave
    String descripcion
    String unidad
    String presentacion
    BigDecimal gramos
    Boolean nacional

    //
    BigDecimal cantidad = 0.0
    BigDecimal precio = 0.0
    BigDecimal importe = 0.0
    BigDecimal descuento = 0.0
    BigDecimal descuentoImporte = 0.0
    BigDecimal subtotal = 0.0
    BigDecimal impuesto = 0.0
    BigDecimal impuestoTasa = 0.16
    BigDecimal total = 0.0
    BigDecimal kilos = 0.0
    // Valores historicos
    BigDecimal precioLista
    BigDecimal precioOriginal
    BigDecimal descuentoOriginal
    BigDecimal precioContado
    BigDecimal precioCredito
    BigDecimal importeCortes = 0.0
    // Boolean sinExistencia = false
    // InstruccionCorte corte
    String comentario

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    Pedido pedido
    static belongsTo = [pedido: Pedido]

    static constraints = {
        unidad maxSize: 10
        presentacion nullable: true, maxSize: 100
        comentario nullable: true
        // corte nullable: true
        createUser nullable: true
        updateUser nullable: true
    }

     static mapping = {
        id generator: 'assigned'
        clave index: 'PEDIDODET_PROD_IDX1'
        descripcion index: 'PEDIDODET_PROD_IDX1'
    }
}
