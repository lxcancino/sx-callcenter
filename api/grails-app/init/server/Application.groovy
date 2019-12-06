package server

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import org.springframework.context.annotation.ComponentScan

@ComponentScan(basePackages = ["sx.firebase"])
class Application extends GrailsAutoConfiguration {
    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }

    void onStartup(java.util.Map<java.lang.String, java.lang.Object> event) {
    	println 'Inicializando'
    }
    void onShutdown(java.util.Map<java.lang.String, java.lang.Object> event) {
    	println 'Finalizando CALL CENTER API server'
    }
}