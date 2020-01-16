package sx.callcenter

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Cliente
import sx.core.Socio


@ToString(includes='nombre, fecha, sucursal, subtotal total',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'id')
class Pedido {

    String id // 1
    Date fecha
    String sucursal
    Long folio
    Cliente cliente // 2
    String nombre
    String rfc
    
    String tipo
    String  formaDePago
    String moneda = 'MXN'
    BigDecimal  tipoDeCambio = 1
    List<PedidoDet> partidas = []
    
    // Importes
    BigDecimal importe
    BigDecimal descuento
    BigDecimal descuentoImporte
    BigDecimal subtotal
    BigDecimal impuesto
    BigDecimal total

    // Precios y descuentos historicos
    BigDecimal descuentoOriginal = 0.0
    BigDecimal cargosPorManiobra = 0.0
    BigDecimal comisionTarjeta = 0.0
    BigDecimal comisionTarjetaImporte = 0.0
    BigDecimal corteImporte = 0.0
    BigDecimal kilos 
    String status
    
    
    String comprador
    String comentario
    String cfdiMail
    String usoDeCfdi

    Socio socio
    
    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    Date cerrado

    // InstruccionDeEnvio envio

    static hasMany =[partidas:PedidoDet]

    static hasOne = [envio: InstruccionDeEnvio]
    

    static constraints = {
        rfc maxSize:13
        folio unique: true
        tipo  inList:['CON','COD','CRE','PSF','INE','OTR','ACF','ANT','AND']
        formaDePago inList: ['DEPOSITO_EFECTIVO', 'DEPOSITO_CHEQUE', 'DEPOSITO_MIXTO', 'TRANSFERENCIA', 'EFECTIVO', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'CHEQUE','CHEQUE_PSTF', 'NO_DEFINIDO']
        moneda inList: ['MXN', 'USD', 'EUR']
        tipoDeCambio scale:6
        usoDeCfdi maxSize:3
        // propiedades opcionales
        comentario nullable: true
        comprador nullable: true
        cfdiMail nullable: true
        socio nullable: true
        envio nullable: true
        status maxSize: 20
        cerrado nullable: true
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



