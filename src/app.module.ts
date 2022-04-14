import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecureService } from './utils/secure.service';
import globals from './config/global.config';
import pgConfig from './config/postgres-db.config';
import { DatabaseModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middlewares/log-incoming-request.middleware';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [globals, pgConfig],
		}),
		DatabaseModule,
		forwardRef(() => UsersModule),
		TasksModule,
		AuthModule,
		LoggerModule,
	],
	controllers: [],
	providers: [SecureService],
	exports: [SecureService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
