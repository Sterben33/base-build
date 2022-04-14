import { ACCESS_SECRET } from '../../config/global.config';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(ACCESS_SECRET),
		});
	}

	validate(payload: Omit<User, 'passwordHash'>) {
		return {
			id: payload.id,
			email: payload.email,
			firstName: payload.firstName,
			lastName: payload.lastName,
		};
	}
}
