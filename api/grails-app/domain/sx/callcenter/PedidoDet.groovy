package sx.callcenter

class PedidoDet {

    String  id

    String    producto

    String   sucursal

    Pedido  pedido

    BigDecimal  cantidad = 0.0

    BigDecimal  precio = 0.0

    BigDecimal  importe = 0.0

    BigDecimal  descuento = 0.0

    BigDecimal  descuentoImporte = 0.0

    BigDecimal  subtotal = 0.0

    BigDecimal impuesto = 0.0

    BigDecimal impuestoTasa = 0.16

    BigDecimal total = 0.0

    Boolean nacional = true

    BigDecimal  kilos = 0.0

    String  comentario

    BigDecimal  precioLista = 0.0

    BigDecimal  precioOriginal = 0.0

    BigDecimal  descuentoOriginal = 0.0

    BigDecimal  importeCortes = 0.0

    BigDecimal devuelto

    BigDecimal enviado = 0.0

    Boolean sinExistencia = false

    // InstruccionCorte corte

    Date dateCreated
    Date lastUpdated

    static belongsTo = [pedido: Pedido]

    static constraints = {
        comentario nullable: true
        inventario nullable: true
        corte nullable: true
        sinExistencia nullable: true
    }

     static mapping = {
        id generator:'uuid'
        producto index: 'VENTADET_IDX2'
    }
}
