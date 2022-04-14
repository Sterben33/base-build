import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { SALT_ROUNDS } from '../config/global.config';

@Injectable()
export class SecureService {
	constructor(private readonly configService: ConfigService) {}

	async hashString(text: string): Promise<string> {
		return hash(text, this.configService.get(SALT_ROUNDS));
	}
	async compare(data: string, encrypted: string): Promise<boolean> {
		return compare(data, encrypted);
	}
}
