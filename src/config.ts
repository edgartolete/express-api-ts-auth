export const mode = {
	test: process.env.NODE_ENV === 'testing',
	dev: process.env.NODE_ENV === 'development',
	prod: process.env.NODE_ENV === 'production'
};
