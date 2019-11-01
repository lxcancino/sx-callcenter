package sx.sat


class BancoSat {

    String id

    String clave

    String nombreCorto

    String razonSocial

    static constraints = {
        clave nullable:false,unique:true,maxSize:20
    }

    String toString(){
        return "$clave $nombreCorto"
    }

    static  mapping={
        id generator:'uuid'
    }
}
