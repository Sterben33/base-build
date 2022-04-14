export const POSTGRES_HOST = 'POSTGRES_HOST';
export const POSTGRES_PORT = 'POSTGRES_PORT';
export const POSTGRES_USER = 'POSTGRES_USER';
export const POSTGRES_PASSWORD = 'POSTGRES_PASSWORD';
export const POSTGRES_DB = 'POSTGRES_DB';

export default () => ({
	[POSTGRES_HOST]: process.env[POSTGRES_HOST] || 'localhost',
	[POSTGRES_PORT]: Number(process.env[POSTGRES_PORT]) || 5442,
	[POSTGRES_USER]: process.env[POSTGRES_USER] || 'postgres',
	[POSTGRES_PASSWORD]: process.env[POSTGRES_PASSWORD] || 'vcxz',
	[POSTGRES_DB]: process.env[POSTGRES_DB] || 'base_db',
});
