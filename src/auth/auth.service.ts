import { USER_WITH_EMAIL_NOT_FOUND_ERROR } from './../users/users.constants';
import { ACCESS_SECRET, REFRESH_SECRET } from './../config/configuration';
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
import { INVALID_REFRESH_TOKEN, WRONG_PASSWORD_ERROR } from './auth.constants';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		@InjectRepository(RefreshToken)
		private readonly refreshTokenRepository: Repository<RefreshToken>,
	) {}

	async refresh(refreshStr: string): Promise<string | undefined> {
		const refreshToken = await this.retrieveRefreshToken(refreshStr);
		if (!refreshToken) {
			throw new UnprocessableEntityException(INVALID_REFRESH_TOKEN);
		}
		console.log(refreshToken);

		const user = await this.usersService.findOneById(
			refreshToken.userId as unknown as number,
		);
		if (!user) {
			throw new UnprocessableEntityException(INVALID_REFRESH_TOKEN);
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
	): Promise<{ accessToken: string; refreshToken: string }> {
		const user = await this.usersService.findOneByEmail(email);
		if (!user) {
			throw new UnauthorizedException(USER_WITH_EMAIL_NOT_FOUND_ERROR);
		}
		if (!(await compare(password, user.passwordHash))) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return this.newRefreshAndAccessToken(user, values);
	}

	private async newRefreshAndAccessToken(
		user: User,
		values: { userAgent: string; ipAddress: string },
	): Promise<{ accessToken: string; refreshToken: string }> {
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
					userId: user.id,
					userEmail: user.email,
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
			throw new UnprocessableEntityException(INVALID_REFRESH_TOKEN);
		}
		this.refreshTokenRepository.delete(refreshToken.id);
	}
}
