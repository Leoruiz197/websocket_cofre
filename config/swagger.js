const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cofre API',
            version: '1.0.0',
            description: 'API para controle de cofres com fila e ESP32'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                url: 'https://websocket-cofre.onrender.com'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js'] // onde estão as rotas documentadas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;