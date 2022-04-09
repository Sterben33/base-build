import { LoginDto } from './dto/login.dto';
import { Body, Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RefreshTokenDto from './dto/refresh-token.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(
		@Req() request: Request,
		@Ip() ip: string,
		@Body() body: LoginDto,
	) {
		return this.authService.login(body.email, body.password, {
			ipAddress: ip,
			userAgent: request.headers['user-agent'],
		});
	}

	@Post('refresh')
	async refreshToken(@Body() body: RefreshTokenDto) {
		return this.authService.refresh(body.refreshToken);
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Body() body: RefreshTokenDto) {
		return this.authService.logout(body.refreshToken);
	}
}
