import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

// configure swagger
export const swaggerConfig = new DocumentBuilder()
	.setTitle('Kuzmath Server')
	.setDescription('Kuzmath API documentation')
	.setVersion('0.0.1')
	.setContact('George Khondar', 'kuzmath.com', 'george-eclipse@yandex.ru')
	.addServer(`${process.env.API_URL}`, 'Development Server')
	.addBearerAuth()
	.build();

// adding custom options
export const customOptions: SwaggerCustomOptions = {
	swaggerOptions: {
		persistAuthorization: true,
	},
	//customCss: '.swagger-ui .topbar { display: none }',
	customSiteTitle: 'Kuzmath Server API Docs',
	//customfavIcon: '',
};
