import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
	let app: INestApplication;
	const cretedUser = {
		email: 'a@mail.ru',
		password: 'qwehsbay27dghas',
		passwordConfirm: 'qwehsbay27dghas',
		firstName: 'Bob',
		lastName: 'M',
	};
	let cretedUserId: number;
	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});
	describe('/users (GET)', () => {
		it('success', async () => {
			const { status, body } = await request(app.getHttpServer()).get('/users');
			expect(status).toBe(200);
			expect(body).toBeInstanceOf(Array);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
