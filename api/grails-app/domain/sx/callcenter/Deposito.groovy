package sx.callcenter

class Deposito {

    String	id

    String sucursal

    String cliente

    String	cobro

    String banco

    String cuentaDeBanco

    String	tipo = 'NORMAL'

    Integer	folio = 0

    Date	fecha

    Date	fechaDeposito

    String	referencia

    BigDecimal	cheque	 = 0.0

    BigDecimal	efectivo = 0.0

    BigDecimal	transferencia = 0.0

    BigDecimal	total = 0.0

    String	comentario

    Date	cancelacion

    String	cancelacionComentario

    Boolean	enviado	 = false

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser

    static mapping={
        id generator: 'uuid'
        fechaDeposito type: 'date'
        fecha type: 'date'
    }

    static constraints = {
        cobro nullable: true
        cancelacion nullable: true
        cancelacionComentario nullable: true
        comentario nullable: true
        createUser nullable: true
        updateUser nullable: true
    }
}
