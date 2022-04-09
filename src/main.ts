import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/custom-logger.service';

async function bootstrap() {
	// Logger for app
	const logger = new CustomLoggerService();
	const app = await NestFactory.create(AppModule, {
		logger: logger,
	});

	// Swagger setup
	const config = new DocumentBuilder()
		.setTitle('Cats example')
		.setDescription('The cats API description')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	// Global pipes
	app.useGlobalPipes(new ValidationPipe());

	const port = process.env.PORT || 3000;
	await app.listen(port, () => {
		logger.log(`App has started on port ${port}.`, 'Bootstrap');
	});
}
bootstrap();
