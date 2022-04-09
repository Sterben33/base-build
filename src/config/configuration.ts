export const PORT = 'PORT';
export const POSTGRES_HOST = 'POSTGRES_HOST';
export const POSTGRES_PORT = 'POSTGRES_PORT';
export const POSTGRES_USER = 'POSTGRES_USER';
export const POSTGRES_PASSWORD = 'POSTGRES_PASSWORD';
export const POSTGRES_DB = 'POSTGRES_DB';
export const JWT_SECRET = 'JWT_SECRET';
export const REFRESH_SECRET = 'REFRESH_SECRET';
export const ACCESS_SECRET = 'ACCESS_SECRET';
export const SALT_ROUNDS = 'SALT_ROUNDS';

export default () => ({
	[PORT]: Number(process.env[PORT]) || 3000,
	[POSTGRES_HOST]: process.env[POSTGRES_HOST] || 'localhost',
	[POSTGRES_PORT]: Number(process.env[POSTGRES_PORT]) || 5442,
	[POSTGRES_USER]: process.env[POSTGRES_USER] || 'postgres',
	[POSTGRES_PASSWORD]: process.env[POSTGRES_PASSWORD] || 'vcxz',
	[POSTGRES_DB]: process.env[POSTGRES_DB] || 'base_db',
	[JWT_SECRET]: process.env[JWT_SECRET] || 'JWT_SECRET',
	[REFRESH_SECRET]: process.env[REFRESH_SECRET] || 'REFRESH_SECRET',
	[ACCESS_SECRET]: process.env[ACCESS_SECRET] || 'ACCESS_SECRET',
	[SALT_ROUNDS]: Number(process.env[SALT_ROUNDS]) || 10,
});
