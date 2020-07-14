package sx.cloud

import groovy.util.logging.Slf4j

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


  /* *
  * Datos de prueba:
  * def pdfPath = "https://firebasestorage.googleapis.com/v0/b/siipapx-51354.appspot.com/o/cfdis%2FTAFACCON-89265.pdf?alt=media&token=c9b1a93d-ea0e-47d6-9804-ee0d5fafd845"
  * URL url = new URL(path);
  * url.getBytes().encodeBase64()
  *
  *
  */
  def enviarCfdi(String pdfPath, String targetEmail, String factura) throws MailjetException, MailjetSocketTimeoutException {
    
    MailjetClient client
    MailjetRequest request
    MailjetResponse response

    String message = """Apreciable cliente por este medio le hacemos llegar la factura electrónica de su compra. Este correo se envía de manera autmática favor de no responder a la dirección del mismo. Cualquier duda o aclaración 
                la puede dirigir a: servicioaclientes@papelsa.com.mx 
            """
    def pdfEncoded = new URL(pdfPath).getBytes().encodeBase64()
    
      client = new MailjetClient(System.getenv("MJ_APIKEY_PUBLIC"), System.getenv("MJ_APIKEY_PRIVATE"), new ClientOptions("v3.1"));
      request = new MailjetRequest(Emailv31.resource)
      .property(Emailv31.MESSAGES, new JSONArray()
                .put(new JSONObject()
                    .put(Emailv31.Message.FROM, new JSONObject()
                        .put("Email", 'facturacion@papelsa.mobi')
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
                            .put("Base64Content", pdfEncoded)))
                    ));

      response = client.post(request);
      log.info('Response Status: {}', response.getStatus())
      log.info('Response Data: {}', response.getData())
  }

}