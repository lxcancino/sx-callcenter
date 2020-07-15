package sx.cloud

import groovy.util.logging.Slf4j

import org.springframework.beans.factory.annotation.Value

import com.mailjet.client.errors.MailjetException
import com.mailjet.client.errors.MailjetSocketTimeoutException
import com.mailjet.client.MailjetClient
import com.mailjet.client.MailjetRequest
import com.mailjet.client.MailjetResponse
import com.mailjet.client.ClientOptions
import com.mailjet.client.resource.Emailv31

import org.json.JSONArray
import org.json.JSONObject
  
@Slf4j
class MailJetService {

  @Value('${MJ_APIKEY_PUBLIC}')
  String mailJetPublicKey;
 
  @Value('${MJ_APIKEY_PRIVATE}')
  String mailJetPrivateKey;


  /* *
  * Datos de prueba:
  * def pdfPath = "https://firebasestorage.googleapis.com/v0/b/siipapx-436ce.appspot.com/o/cfdis%2FTAFACCON-83735.pdf?alt=media&token=9c36de27-25af-45df-8fbb-6ac04f7e0175"
  * def xmlPath = "https://firebasestorage.googleapis.com/v0/b/siipapx-436ce.appspot.com/o/cfdis%2FTAFACCON-83735.xml?alt=media&token=b6023eb6-8176-424e-aee7-4a9f097e100e"
  * URL url = new URL(path);
  * url.getBytes().encodeBase64()
  *
  *
  */
  def enviarCfdi(
      String sourceEmail, 
      String targetEmail, 
      String factura,
      String pdfPath, 
      String xmlPath
      ) throws MailjetException, MailjetSocketTimeoutException {

    String message = """Apreciable cliente por este medio le hacemos llegar la factura electrónica de su compra. 
      Este correo se envía de manera autmática favor de no responder a la dirección del mismo. 
      Cualquier duda o aclaración la puede dirigir a: servicioaclientes@papelsa.com.mx 
            """
    def pdfEncoded = new URL(pdfPath).getBytes().encodeBase64()
    def xmlEncoded = new URL(xmlPath).getBytes().encodeBase64()
    
    MailjetClient client = new MailjetClient(mailJetPublicKey,mailJetPrivateKey,new ClientOptions("v3.1"))

    MailjetRequest request = new MailjetRequest(Emailv31.resource)
      .property(Emailv31.MESSAGES, new JSONArray()
                .put(new JSONObject()
                    .put(Emailv31.Message.FROM, new JSONObject()
                        .put("Email", sourceEmail)
                        .put("Name", "Mailjet Pilot"))
                    .put(Emailv31.Message.TO, new JSONArray()
                        .put(new JSONObject()
                            .put("Email", targetEmail)
                            .put("Name", "NOMBRE DEL CLIENTE")))
                    .put(Emailv31.Message.SUBJECT, "Envío de CFDI: ${factura}")
                    .put(Emailv31.Message.TEXTPART, message)
                    // .put(Emailv31.Message.HTMLPART, "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!")
                    .put(Emailv31.Message.ATTACHMENTS, new JSONArray()
                        .put(new JSONObject()
                            .put("ContentType", "application/pdf")
                            .put("Filename", "${factura}.pdf")
                            .put("Base64Content", pdfEncoded))
                        .put(new JSONObject()
                            .put("ContentType", "application/xml")
                            .put("Filename", "${factura}.xml")
                            .put("Base64Content", xmlEncoded))
                        )
                    ));

      MailjetResponse response = client.post(request);
      log.info('Response Status: {}', response.getStatus())
      log.info('Response Data: {}', response.getData())
  }

}


