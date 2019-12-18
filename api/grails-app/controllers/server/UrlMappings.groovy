package server

class UrlMappings {

    static mappings = {

        "/api/config"(resource: 'appConfig', includes:['index', 'show'])
        "/api/clientes"(resources: 'cliente', excludes: ['create', 'edit', 'delete'])
        "/api/sucursales"(resources: 'sucursal', includes:['index', 'show'])
        "/api/productos"(resources: 'producto', includes:['index', 'show'])
        "/api/depositos/"(resources: 'deposito', excludes: ['create', 'edit', 'delete'])
        "/api/depositos/bancos"(controller: 'deposito', action: 'bancos', method: 'GET')
        "/api/depositos/cuentas"(controller: 'deposito', action: 'cuentas', method: 'GET')
        
        "/api/productos"(resources: 'producto', excludes: ['create', 'edit', 'delete'])
        "/api/pedidos"(resources: 'pedido', excludes: ['create', 'edit'])
        "/api/pedido/print/$id"(controller: 'pedido', action: 'print', method: 'GET')

        
        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
