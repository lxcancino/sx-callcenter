package sx.cloud.papws

import java.text.SimpleDateFormat

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.storage.Blob
import com.google.cloud.storage.Bucket
import groovy.sql.Sql
import groovy.util.logging.Slf4j

import sx.core.Sucursal
import sx.callcenter.Autorizacion
import sx.callcenter.InstruccionDeEnvio
import sx.callcenter.Pedido
import sx.cloud.FirebaseService
import sx.cloud.LxPedido
import sx.cloud.LxPedidoDet

import javax.sql.DataSource

@Slf4j
class PedidosMigrationService {

  PapelsaCloudService papelsaCloudService
  FirebaseService firebaseService
  DataSource dataSource

  SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")

  PedidosMigrationService() {
    sdf.setTimeZone(TimeZone.getTimeZone("CET"))
  }

  void migrarPedidosFacturados(String desde, String hasta) {
    List<Pedido> pedidos = fetchPedidosFacturados(desde, hasta)
    pedidos.each {
      Map data = mapPedido(it)

      ApiFuture<WriteResult> res =
        papelsaCloudService.getFirestore()
        .collection('pedidos')
        .document(it.id)
        .set(data, SetOptions.merge())

      log.info('Migrated at {}', res.get().updateTime.toDate())

    }
  }

  void migrarPedidosPendientes(String desde, String hasta) {
    List<Pedido> pedidos = fetchPedidosPendientes(desde, hasta)
    pedidos.each {
      Map data = mapPedido(it)

      ApiFuture<WriteResult> res =
        papelsaCloudService.getFirestore()
        .collection('pedidos')
        .document(it.id)
        .set(data, SetOptions.merge())

      log.info('Migrated at {}', res.get().updateTime.toDate())

    }
  }

  /*
  * Este metodo debe ser modificado para usar Firebase
  *
  */
  List<Pedido> fetchPedidosFacturados(String sfrom, String sto) {
    String format = 'dd/MM/yyyy'
    Date fechaIni = Date.parse(format,sfrom)
    Date fechaFin = Date.parse(format,sto)
    return Pedido.findAll("""
      from Pedido p where p.fecha between :inicio and :hasta
      and p.status in ('FACTURADO_TIMBRADO')
      order by p.fecha
      """,
    [inicio: fechaIni, hasta: fechaFin])
  }

  /*
  *
   */
  List<Pedido> fetchPedidosPendientes(String sfrom, String sto) {
    String format = 'dd/MM/yyyy'
    Date fechaIni = Date.parse(format,sfrom)
    Date fechaFin = Date.parse(format,sto)

    /*
    return Pedido.findAll("""
      from Pedido p where p.fecha between :inicio and :hasta
      and p.status in ('CERRADO', 'COTIZACION')
      order by p.fecha
      """,
      */
    return Pedido.findAll("""
      from Pedido p where p.fecha between :inicio and :hasta
      and p.status in ('CERRADO', 'COTIZACION')
      order by p.fecha
      """,
    [inicio: fechaIni, hasta: fechaFin])
  }

  
    

  Map mapPedido(Pedido p) {
    LxPedido pedido = new LxPedido(p)
    Map<String, Object> data = pedido.properties
    data = data.findAll{ k, v -> k != 'class'}
    data.vigencia = data.fecha + 10
    // data.fecha = sdf.format(data.fecha)
    Sucursal sucursal = fetchSucursal(p.sucursal)
    data.sucursalId = sucursal.id
    if(p.socio) {
      data.socio = p.socio.id
    }
    if(p.envio) {
      InstruccionDeEnvio envio = p.envio as InstruccionDeEnvio
      Map direccion = envio.direccion.toFirebaseMap() // toFirebaseMap(p.envio.direccion)
      direccion.latitud = null
      direccion.longitud = null
      Map envioMap = [
        tipo: envio.tipo,
        direccion: direccion,
        transporte: envio?.transporte?.id,
        telefono: envio.telefono,
        contacto: envio.contacto,
        horario: envio.horario,
        comentario: envio.comentario,
        fechaDeEntrega: envio.fechaDeEntrega
      ]
      data.envio = envioMap
    }
    def partidas = p.partidas.collect{ det ->
      def producto = det.producto
      def item = new LxPedidoDet(det).toFirebaseMap()
      item.productoId = det.producto.id
      item.producto = [
        id: producto.id,
        clave: item.clave,
        descripcion: item.descripcion,
        precioCredito: item.precioCredito,
        precioContado: item.precioContado,
        unidad: producto.unidad,
        kilos: producto.kilos,
        gramos: producto.gramos,
        modoVenta: producto.modoVenta,
        presentacion: producto.presentacion
      ]
      return item
    }
    data.partidas = partidas
    data.appVersion = 1
    data.updateUser = data.updateUser
    data.updateUserId = data.updateUser
    data.createUser = data.createUser
    data.createUserId = data.createUser

    if(p.autorizacion) {
      Autorizacion auth = p.autorizacion
      data.autorizacion =  [
        solicita: auth.solicita,
        autoriza: auth.autoriza,
        uid: auth.autoriza,
        comentario: auth.comentario,
        dateCreated: auth.dateCreated
      ]
      data.autorizacionesRequeridas = p.autorizacionesRequeridas
    }
    if(p.status == 'FACTURADO_TIMBRADO' ) {
      Map factura = fetchCfdi(p)
      // Map factura = fetchFromFirebase(p.id)
      log.info('Factura: {}', factura)
      data.factura = factura
    }
    return data
  }

  Sucursal fetchSucursal(String nombre) {
    String real = nombre == 'CALLE 4' ? 'CALLE4' : nombre
    return Sucursal.findByNombre(real)
  }


  Map toFirebaseMap(def source) {
    Map<String, Object> data = source.properties
    Map res = filter(data)
    return res
  }

  Map filter(Map data) {
    data = data.findAll{ k, v -> !['class','version', 'constraints', 'errors','metaClass', 'additionalMetaMethods'].contains(k) }
    return data
  }

  Map fetchCfdi(Pedido pedido) {
    if(pedido.uuid) {
      log.info('Buscando cfdi: {}', pedido.uuid)
      Map cfdi = new Sql(dataSource).firstRow("select * from siipapx.cfdi where uuid = ?"
        , [pedido.uuid])
      if(cfdi) {
        return [
          serie: cfdi.serie,
          folio: cfdi.folio,
          uuid: cfdi.uuid,
          cfdi: cfdi.id,
          createUser: 'ND',
          updateUser: 'ND'
        ]
      } else {
        log.info('Not found in MySql, fetching from firebase')
        return this.fetchFromFirebase(pedido.id)
      }
    }
  }

  Map fetchFromFirebase(String pedidoId) {
    log.info('Factura data from firebase para PedidoId: {}', pedidoId)
    Map data =  this.firebaseService.getFirestore()
    .document("pedidos_log/${pedidoId}")
      .get()
      .get()
      .getData()
    log.info('Data: {}', data)
    def payload =   data.facturacion
    Map factura = [
      serie: payload.serie,
      folio: payload.folio,
      uuid: payload.cfdi.uuid,
      cfdi: payload.cfdi.id,
      createUser: 'ND',
      updateUser: 'ND',
      // pdfUrl: getDownloadUrl(payload.serie, payload.folio, 'pdf'),
      // xmlUrl: getDownloadUrl(payload.serie, payload.folio, 'xml'),
    ]
    return factura
  }

  String getDownloadUrl(String serie, String folio, String suff) {
    if(this.bucket == null) {
      this.bucket = this.firebaseService.getStorage().bucket()
    }
    String pathToFile = "cfdis/${serie}-${folio}.${suff}"
    Blob blob = this.bucket.get(pathToFile)
    String bn = this.bucket.name
    createPersistentDownloadUrl(bn, pathToFile, blob.metadata.firebaseStorageDownloadTokens)
  }

  String createPersistentDownloadUrl(bucket, pathToFile, downloadToken){
    def path = java.net.URLEncoder.encode(pathToFile, "UTF-8")
    return "https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${path}?alt=media&token=${downloadToken}";
  };

  Bucket bucket;



}
