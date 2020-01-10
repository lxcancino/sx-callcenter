package sx.core

import groovy.util.logging.Slf4j
import groovy.transform.CompileDynamic

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic


import sx.core.FolioLog

@Slf4j
@Transactional
@GrailsCompileStatic
class ClienteService implements FolioLog{

    Cliente save(Cliente cliente) {
    	if(cliente.id)
    		return cliente
    	log.debug("Salvando cliente nuevo {}", cliente)
        def folio = nextFolio('CLIENTE', 'CALLCENTER').toString()
        folio = folio.padLeft(7, '0')
        def clave = "SXCC${folio}"
        log.info('Clave generada para cliente nuevo {} : {} ', cliente.nombre, clave);
        cliente.clave = clave
        cliente.vendedor = Vendedor.where { nombres == 'CASA'}.find()
        cliente.save failOnError: true, flush: true
        return cliente
    }
    
}
