import { dataSource } from '../Connections/typeorm';
import { App } from '../Entities/appsEntity';

const app = dataSource.getRepository(App);

export type AppCreateType = {
	code: string;
	name?: string;
	description?: string;
	apiKey: string;
	accessTokenSecret: string;
	refreshTokenSecret: string;
};

export const appModel = {
	find: async (code: string) => {
		return await App.findBy({ code });
	},
	create: async (app: AppCreateType) => {
		return await dataSource.createQueryBuilder().insert().into(App).values(app).execute();
	}
};
