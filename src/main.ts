import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, customOptions } from './swagger';
import { TokensService } from './modules/tokens/tokens.service';
import { authMiddleware } from './middleware/auth.middleware';

async function bootstrap() {
	const PORT = process.env.PORT || 5000;
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());

	// const authMiddleware = app.get(AuthMiddleware);

	app.use(['/api', '/api-json'], authMiddleware);

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, document, customOptions);

	await app.listen(PORT, () => {
		console.log(`Server startet on port ${PORT}`);
	});
}
bootstrap();
