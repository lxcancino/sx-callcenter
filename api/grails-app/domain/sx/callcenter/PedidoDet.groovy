package sx.callcenter

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Producto
import sx.core.ClienteDireccion

@ToString(includes='id, clave, descripcion, cantidad, precio, descuentoImporte, subtotal',includeNames=true,includePackage=false)
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
    BigDecimal descuentoEspecial = 0.0
    String  modoVenta
    

    BigDecimal importeCortes = 0.0
    
    String comentario
    CorteUnitario corte
    
    BigDecimal faltante = 0.0

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    
    static belongsTo = [pedido: Pedido]
    
    // static hasOne = [corte: CorteUnitario]

    // static embedded = ['corte', 'envio']
    // static embedded = ['corte']

    static constraints = {
        id bindable: true
        unidad maxSize: 10
        presentacion nullable: true, maxSize: 100
        modoVenta inList: ['B','N']
        comentario nullable: true
        corte nullable: true
        faltante nullable: true
        createUser nullable: true
        updateUser nullable: true
        descuentoEspecial nullable: true
    }

     static mapping = {
        id generator: 'assigned'
        clave index: 'PEDIDODET_PROD_IDX1'
        descripcion index: 'PEDIDODET_PROD_IDX1'
    }
}

/*
class Corte {
  double tantos
  String instruccion
  int cantidad
  double precio
  double importe
  boolean refinado
  static constraints = {
    cantidad minSize: 1
  }

}
*/
/*
class EnvioUnitario {
    ClienteDireccion direccion;
    String comentario
}*/
