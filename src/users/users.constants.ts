export const userWithSuchIdDoesNotExists = (userId: number) => {
	return `User with id ${userId} does not exist.`;
};
export const userWithSuchEmailAlreadyExists = (email: string) => {
	return `User with email ${email} already exist.`;
};
export const USER_WITH_EMAIL_NOT_FOUND_ERROR =
	'User with such email was not found';
export const USER_WITH_ID_NOT_FOUND_ERROR = 'User with such id was not found';
