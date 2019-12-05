package sx.callcenter

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Cliente


@ToString(includes='nombre, fecha, sucursal, subtotal total',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'id')
class Pedido {

    String id // 1
    Date fecha
    String sucursal
    String folio
    Cliente cliente // 2
    String nombre
    Sring rfc
    String socio
    String tipo
    String  formaDePago
    String moneda = 'MXN'
    BigDecimal  tipoDeCambio = 1
    List<PedidoDet> partidas = []
    // Importes
    BigDecimal importe  = 0
    BigDecimal descuento = 0
    BigDecimal descuentoImporte = 0
    BigDecimal subtotal = 0
    BigDecimal impuesto = 0
    BigDecimal total = 0
    BigDecimal descuentoOriginal = 0
    BigDecimal cargosPorManiobra = 0
    BigDecimal comisionTarjeta = 0
    BigDecimal comisionTarjetaImporte = 0
    BigDecimal corteImporte = 0
    
    
    BigDecimal  kilos = 0
    String  comprador
    String  comentario
    String envio
    String cfdiMail
    String usoDeCfdi
    Boolean sinExistencia
    Boolean chequePostFechado;
    Boolean ventaIne;
    
    
    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    static hasMany =[partidas:PedidoDet]

    static constraints = {
        rfc maxSize:13
        tipo  inList:['CON','COD','CRE','PSF','INE','OTR','ACF','ANT','AND']
        documento maxSize: 20
        tipoDeCambio scale:6
        comentario nullable: true
        comprador nullable: true
        cfdiMail nullable: true
        usoDeCfdi nullable: true, maxSize:3
        envio nullable: true
        socio nullable: true
        sinExistencia nullable: true
        chequePostFechado nullable: true
        ventaIne nullable: true
        createUser nullable:true, maxSize: 100
        updateUser nullable:true, maxSize: 100
    }
    
     static mapping = {
        partidas cascade: "all-delete-orphan"
        id generator:'uuid'
        fecha type:'date' ,index: 'PEDIDO_IDX1'
        nombre index: 'PEDIDO_IDX2'
        rfc index: 'PEDIDO_IDX2B'
    }
}
