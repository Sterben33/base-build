import { LoginDto } from './dto/login.dto';
import {
	Body,
	Controller,
	HttpCode,
	Ip,
	Post,
	Req,
	UnprocessableEntityException,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import RefreshTokenDto from './dto/refresh-token.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponceDto } from './dto/login-responce.dto';
import { RegistrationDto } from './dto/registration.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { PASSWORDS_MUST_MATCH_ERROR } from './auth.constants';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@ApiOperation({ summary: 'User authentication' })
	@ApiResponse({ status: 200, type: [LoginResponceDto] })
	@Post('login')
	async login(
		@Req() { headers }: Request,
		@Ip() ip: string,
		@Body() { email, password }: LoginDto,
	) {
		return this.authService.login(email, password, {
			ipAddress: ip,
			userAgent: headers['user-agent'],
		});
	}

	@ApiOperation({ summary: 'Registration of the new user' })
	@ApiResponse({ status: 200, type: [LoginResponceDto] })
	@Post('register')
	async register(@Body() registrationDto: RegistrationDto): Promise<User> {
		if (registrationDto.password !== registrationDto.passwordConfirm) {
			throw new UnprocessableEntityException(PASSWORDS_MUST_MATCH_ERROR);
		}
		return this.usersService.create(registrationDto as CreateUserDto);
	}

	@ApiOperation({ summary: 'Refresh user access token' })
	@ApiResponse({ status: 200 })
	@Post('refresh')
	async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
		return this.authService.refresh(refreshToken);
	}

	@HttpCode(200)
	@ApiOperation({ summary: 'Logout user (deletes refresh token)' })
	@ApiResponse({ status: 200 })
	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Body() { refreshToken }: RefreshTokenDto) {
		return this.authService.logout(refreshToken);
	}
}
