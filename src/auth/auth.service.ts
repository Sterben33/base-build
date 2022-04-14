import { USER_WITH_EMAIL_NOT_FOUND_ERROR } from './../users/users.constants';
import { ACCESS_SECRET, REFRESH_SECRET } from '../config/global.config';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { UsersService } from './../users/users.service';
import { User } from './../users/entities/user.entity';
import {
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import RefreshToken from './entities/refresh-token.entity';
import { sign, verify } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
	INVALID_REFRESH_TOKEN_ERROR,
	WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { LoginResponceDto } from './dto/login-responce.dto';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		@InjectRepository(RefreshToken)
		private readonly refreshTokenRepository: Repository<RefreshToken>,
		private readonly logger: CustomLoggerService,
	) {}

	async refresh(refreshStr: string): Promise<string | undefined> {
		const refreshToken = await this.retrieveRefreshToken(refreshStr);
		if (!refreshToken) {
			this.logger.warn(INVALID_REFRESH_TOKEN_ERROR, this.constructor.name);
			throw new UnprocessableEntityException(INVALID_REFRESH_TOKEN_ERROR);
		}

		const user = await this.usersService.findOneById(
			refreshToken.userId as unknown as number,
		);
		if (!user) {
			this.logger.warn(INVALID_REFRESH_TOKEN_ERROR, this.constructor.name);
			throw new UnprocessableEntityException(INVALID_REFRESH_TOKEN_ERROR);
		}

		const accessToken = {
			userId: user.id,
			userEmail: user.email,
		};

		return sign(accessToken, this.configService.get(ACCESS_SECRET), {
			expiresIn: '1h',
		});
	}

	private retrieveRefreshToken(
		refreshStr: string,
	): Promise<RefreshToken | undefined> {
		try {
			const decoded = verify(
				refreshStr,
				this.configService.get(REFRESH_SECRET),
			);
			if (typeof decoded === 'string') {
				return undefined;
			}
			return this.refreshTokenRepository.findOne(decoded.id);
		} catch (e) {
			return undefined;
		}
	}

	async login(
		email: string,
		password: string,
		values: { userAgent: string; ipAddress: string },
	): Promise<LoginResponceDto> {
		const user = await this.usersService.findOneByEmail(email);
		if (!user) {
			this.logger.warn(USER_WITH_EMAIL_NOT_FOUND_ERROR, this.constructor.name);
			throw new UnauthorizedException(USER_WITH_EMAIL_NOT_FOUND_ERROR);
		}
		if (!(await compare(password, user.passwordHash))) {
			this.logger.warn(WRONG_PASSWORD_ERROR, this.constructor.name);
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return this.newRefreshAndAccessToken(user, values);
	}

	private async newRefreshAndAccessToken(
		user: User,
		values: { userAgent: string; ipAddress: string },
	): Promise<LoginResponceDto> {
		const refreshObject = this.refreshTokenRepository.create({
			userId: user,
			...values,
		});
		await this.refreshTokenRepository.save(refreshObject);

		return {
			refreshToken: sign(
				{ ...refreshObject, userId: refreshObject.userId.id },
				this.configService.get(REFRESH_SECRET),
			),
			accessToken: sign(
				{
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
				},
				this.configService.get(ACCESS_SECRET),
				{
					expiresIn: '1h',
				},
			),
		};
	}

	async logout(refreshStr: string): Promise<void> {
		const refreshToken = await this.retrieveRefreshToken(refreshStr);

		if (!refreshToken) {
			this.logger.warn(INVALID_REFRESH_TOKEN_ERROR, this.constructor.name);
			throw new UnprocessableEntityException(INVALID_REFRESH_TOKEN_ERROR);
		}
		this.refreshTokenRepository.delete(refreshToken.id);
	}
}
