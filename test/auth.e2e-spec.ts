import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	const cretedUser = {
		email: 'a@mail.ru',
		password: 'qwehsbay27dghas',
		passwordConfirm: 'qwehsbay27dghas',
		firstName: 'Bob',
		lastName: 'M',
	};
	let cretedUserId: number;
	let accessToken: number;
	let refreshToken: number;
	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});
	describe('/auth/register (POST)', () => {
		it('error - not matching passwords', () => {
			return request(app.getHttpServer())
				.post('/auth/register')
				.send({ ...cretedUser, passwordConfirm: cretedUser.password + '1' })
				.expect(422);
		});

		it('success', async () => {
			const { status, body } = await request(app.getHttpServer())
				.post('/auth/register')
				.send({ ...cretedUser });
			expect(status).toBe(201);
			cretedUserId = body.id;
			expect(cretedUserId).toBeDefined();
		});

		it('error - user with email already exists', async () => {
			const { status } = await request(app.getHttpServer())
				.post('/auth/register')
				.send({ ...cretedUser });
			expect(status).toBe(422);
		});
	});
	describe('/auth/login (POST)', () => {
		it('failed - invalid password', async () => {
			const { status } = await request(app.getHttpServer())
				.post('/auth/login')
				.send({
					email: cretedUser.email,
					password: cretedUser.password + '1',
				})
				.set('User-Agent', 'agent');
			expect(status).toBe(401);
		});
		it('successfull', async () => {
			const { status, body } = await request(app.getHttpServer())
				.post('/auth/login')
				.send({
					email: cretedUser.email,
					password: cretedUser.password,
				})
				.set('User-Agent', 'agent');
			expect(status).toBe(201);
			accessToken = body.accessToken;
			refreshToken = body.refreshToken;
			expect(accessToken).toBeDefined();
			expect(refreshToken).toBeDefined();
		});
	});
	describe('/auth/refresh (POST)', () => {
		it('successfull refresh', async () => {
			const { status } = await request(app.getHttpServer())
				.post('/auth/refresh')
				.send({
					refreshToken,
				})
				.set('Authorization', `bearer ${accessToken}`);
			expect(status).toBe(201);
		});
	});
	describe('/auth/logut (POST)', () => {
		it('successfull logout', async () => {
			const { status } = await request(app.getHttpServer())
				.post('/auth/logout')
				.send({
					refreshToken,
				})
				.set('Authorization', `bearer ${accessToken}`);
			expect(status).toBe(200);
		});
	});

	afterAll(async () => {
		await request(app.getHttpServer()).delete(`/users/${cretedUserId}`);
		await app.close();
	});
});
