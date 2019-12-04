package sx.callcenter

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode


@ToString(includes='cliente, nombre, fecha, sucursal, subtotal total',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'id')
class Pedido {

    String id

    String cliente

    String nombre

    String sucursal

    String sucursalVenta

    String tipo

    Long documento = 0

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

    String  formaDePago

    String moneda = 'MXN'

    BigDecimal  tipoDeCambio = 1

    BigDecimal  kilos = 0

    String  comprador

    String  atencion = 'TELEFONICA'

    String  comentario

    Date fecha

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    String envio

    Boolean cod = false;

    String cfdiMail

    String usoDeCfdi

    List<PedidoDet> partidas = []

    String folio

    Boolean sinExistencia = false

    String socio

    Boolean chequePostFechado = false;

    Boolean ventaIne = false;

    Boolean noFacturable = false;

    Boolean surtido = false

    static hasMany =[partidas:PedidoDet]

    static constraints = {
        nombre nullable: true
        tipo  inList:['CON','COD','CRE','PSF','INE','OTR','ACF','ANT','AND']
        documento maxSize: 20
        tipoDeCambio(scale:6)
        atencion inList:['MOSTRADOR','TELEFONICA','ND']
        clasificacionVale nullable:true,maxSize:30
        comentario nullable:true
        comprador nullable:true
        sucursalVenta nullable:true
        
        createUser nullable:true, maxSize: 100
        updateUser nullable:true, maxSize: 100
        cfdiMail nullable: true
        usoDeCfdi nullable: true, maxSize:3
        envio nullable: true
        importe scale: 2
        sinExistencia nullable: true
        socio nullable: true
        chequePostFechado nullable: true
        facturarUsuario nullable: true
        ventaIne nullable: true
        noFacturable nullable: true
    }

    
     static mapping = {
        partidas cascade: "all-delete-orphan"
        id generator:'uuid'
        fecha type:'date' ,index: 'VENTA_IDX1'
        cliente index: 'VENTA_IDX3'
    }
}
