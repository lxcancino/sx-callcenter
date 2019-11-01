package sx.callcenter


import grails.rest.*
import grails.converters.*

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import sx.sat.BancoSat
import sx.tesoreria.Banco
import sx.tesoreria.CuentaDeBanco

@GrailsCompileStatic
@Secured("permitAll")
class DepositoController extends RestfulController<Deposito> {
    static responseFormats = ['json']
    
    DepositoController() {
        super(Deposito)
    }

    @Override
    protected List<Deposito> listAllResources(Map params) {
        log.info('List: {}', params)
        return Deposito.list(params)
    }


    def bancos() {
    	respond BancoSat.list()
    }

    def cuentas() {
    	respond CuentaDeBanco.list()
    }
}
