package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode



import sx.callcenter.Pedido

@ToString(includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'folio')
class LxPedido {

    String id 
    String sucursal
    Date fecha
    Long folio
    Map cliente
    String nombre
    String rfc

    String tipo
    String  formaDePago
    String moneda = 'MXN'
    Double  tipoDeCambio = 1.0

    //
    
    // Importes
    Double importe
    Double descuento
    Double descuentoImporte
    Double subtotal
    Double impuesto
    Double total

    Double descuentoOriginal = 0.0
    Double cargosPorManiobra = 0.0
    Double comisionTarjeta = 0.0
    Double comisionTarjetaImporte = 0.0
    Double corteImporte = 0.0
    Double kilos 
    String status

    String comprador
    String comentario
    String cfdiMail
    String usoDeCfdi

    
    
    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser
    String socio

    Date cerrado
    Date inicio 

    List<LxPedidoDet> partidas = []
    // Socio socio    
    // String socio

    LxPedido(Pedido pedido) {
        copyProperties(pedido, this)
        this.id = pedido.id
        def cte = pedido.cliente
        if(cte.clave.startsWith('SXCC')) {
            this.cliente = [
                id: cte.id,
                nombre: cte.nombre,
                clave: cte.clave,
                rfc: cte.rfc,
                cfdiMail: cte.cfdiMail,
                direccion: cte.direccion.toFirebaseMap(),
                medios: cte.medios.collect{
                    return [
                        id: it.id,
                        tipo: it.tipo,
                        descripcion: it.descripcion,
                        cfdi: it.cfdi,
                        activo: it.activo,
                        createUser: it.createUser,
                        updateUser: it.updateUser,
                        sucursalCreated: it.sucursalCreated,
                        sucursalUpdated: it.sucursalUpdated
                    ]
                }
            ]
        } else {
            this.cliente =  [
                id: cte.id,
                clave: cte.clave,
                nombre: cte.nombre,
                rfc: cte.rfc,
                cfdiMail: cte.cfdiMail,
                direccion: cte.direccion.toFirebaseMap(),
            ]
        }
        
    }
    
    def copyProperties(source, target) {
        def (sProps, tProps) = [source, target]*.properties*.keySet()
        def commonProps = sProps.intersect(tProps) - [
            'class', 'metaClass', 'additionalMetaMethods', 'socio', 'cliente', 'partidas', 'envio']
        commonProps.each { target[it] = source[it] }
    }
    

}


