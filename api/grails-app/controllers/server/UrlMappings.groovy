package server

class UrlMappings {

    static mappings = {

        "/api/config"(resource: 'appConfig', includes:['index', 'show'])
        "/api/clientes"(resources: 'cliente', excludes: ['create', 'edit', 'delete'])
        "/api/sucursales"(resources: 'sucursal', includes:['index', 'show'])
        
        "/api/productos"(resources: 'producto', includes:['index', 'show'])
        "/api/productos/disponibles"(controller: 'producto', action: 'disponibles')

        "/api/depositos/"(resources: 'deposito', excludes: ['create', 'edit', 'delete'])
        "/api/depositos/bancos"(controller: 'deposito', action: 'bancos', method: 'GET')
        "/api/depositos/cuentas"(controller: 'deposito', action: 'cuentas', method: 'GET')
        
        "/api/productos"(resources: 'producto', excludes: ['create', 'edit', 'delete'])
        "/api/pedidos"(resources: 'pedido', excludes: ['create', 'edit'])
        "/api/pedidos/cerrar/$id"(controller: 'pedido', action: 'cerrar', method: 'PUT')
        "/api/pedidos/autorizar/$id"(controller: 'pedido', action: 'autorizar', method: 'PUT')
        "/api/pedidos/findByFolio"(controller: 'pedido', action: 'findByFolio', method: 'GET')
        "/api/pedidos/print/$id"(controller: 'pedido', action: 'print', method: 'GET')
        "/api/pedidos/buscarSucursal"(controller: 'pedido', action: 'buscarSucursal', method: 'GET')
        "/api/pedidos/historico"(controller: 'pedido', action: 'historico', method: 'GET')

        "/api/zip"(controller: 'zip', action: 'find', method: 'GET')
        "/api/transportes"(resources: 'transporte', excludes: ['create', 'edit', 'delete'])

        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
