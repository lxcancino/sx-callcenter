package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.callcenter.PedidoDet


@ToString(includes='id, clave, descripcion, cantidad, precio, descuentoImporte, subtotal',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'id')
class LxPedidoDet {

    String id
    String producto
    String clave
    String descripcion
    String unidad
    String presentacion
    Double gramos
    Boolean nacional

    //
    Double cantidad = 0.0
    Double precio = 0.0
    Double importe = 0.0
    Double descuento = 0.0
    Double descuentoImporte = 0.0
    Double subtotal = 0.0
    Double impuesto = 0.0
    Double impuestoTasa = 0.16
    Double total = 0.0
    Double kilos = 0.0
    
    Double precioLista
    Double precioOriginal
    Double descuentoOriginal
    String  modoVenta
    

    Double importeCortes = 0.0
    
    String comentario
    Map corte
    
    Double faltante = 0.0

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    LxPedidoDet(PedidoDet pedidoDet) {
        copyProperties(pedidoDet, this)
        this.id = pedidoDet.id
        this.producto = pedidoDet.producto.id
        if(pedidoDet.corte) {
            corte = toFirebaseMap(pedidoDet.corte)
        }
    }
    
    def copyProperties(source, target) {
        def (sProps, tProps) = [source, target]*.properties*.keySet()
        def commonProps = sProps.intersect(tProps) - [
            'class', 'metaClass', 'additionalMetaMethods', 'producto', 'corte']
        commonProps.each { target[it] = source[it] }
    }

    Map toFirebaseMap() {
        Map data = this.properties
        data = data.findAll{ k, v -> k != 'class'}
        return data
    }

    Map toFirebaseMap(def source) {
        Map<String, Object> data = source.properties 
        data = data.findAll{ k, v -> k != 'class'}
        return data
    }
    Map filter(Map data) {
        data = data.findAll{ k, v -> !['class','constraints', 'errors'].contains(k) }
        return data
    }
   
}

