export const swaggerConfig = {
    routePrefix: '/documentation',
    swagger: {
        info: {
            title: 'Fastify Scaffold',
            description:
                'Scaffolding template to quickly set up a development ready HTTP server including unit tests, minification and ORM',
            version: '0.1.0',
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more about swagger here',
        },
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    },
    exposeRoute: true,
};
