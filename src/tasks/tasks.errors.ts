export const couldNotCreateTaskOfNonExistingUserError = (
	userId: number,
): string => {
	return `Could not save task. User with id ${userId} does not exist.`;
};
export const taskDoesNotExistsError = (taskId: number): string => {
	return `Task with id ${taskId} does not exists`;
};
