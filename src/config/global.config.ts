export const PORT = 'PORT';
export const JWT_SECRET = 'JWT_SECRET';
export const REFRESH_SECRET = 'REFRESH_SECRET';
export const ACCESS_SECRET = 'ACCESS_SECRET';
export const SALT_ROUNDS = 'SALT_ROUNDS';

export default () => ({
	[PORT]: Number(process.env[PORT]) || 3000,
	[JWT_SECRET]: process.env[JWT_SECRET] || 'JWT_SECRET',
	[REFRESH_SECRET]: process.env[REFRESH_SECRET] || 'REFRESH_SECRET',
	[ACCESS_SECRET]: process.env[ACCESS_SECRET] || 'ACCESS_SECRET',
	[SALT_ROUNDS]: Number(process.env[SALT_ROUNDS]) || 10,
});
