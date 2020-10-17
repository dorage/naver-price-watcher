import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: '네이버 가격비교 크롤링',
        description: '가격비교 크롤링 정보',
        contact: {
            name: 'kanghyunlee a.k.a dorage',
            email: 'baloonflower554@gmail.com',
            url: 'https://dorage.io',
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    servers: [
        {
            url: 'http://localhost:4000',
        },
    ],
};

const swaggerOptions = {
    swaggerDefinition: swaggerDefinition,
    apis: ['src/routers/*.js', 'src/controllers/*.js', 'src/models/*.js'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
