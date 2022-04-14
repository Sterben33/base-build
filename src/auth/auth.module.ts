import { LoggerModule } from './../logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getJWTConfig } from './jwt.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import RefreshToken from './entities/refresh-token.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([RefreshToken]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
		UsersModule,
		ConfigModule,
		LoggerModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
