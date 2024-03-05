import { dataSource } from '../Connections/typeorm';
import { App } from '../Entities/appsEntity';

const app = dataSource.getRepository(App);

export type AppCreateType = {
	id: number;
	code: string;
	name?: string;
	description?: string;
	apiKey: string;
	accessTokenSecret: string;
	refreshTokenSecret: string;
};

export type AppFindType = {
	id?: number;
	code?: string;
};

export type AppUpdateType = {
	code?: string;
	name?: string;
	description?: string;
};

export type AppRegenerateType = {
	apiKey: string;
	accessTokenSecret: string;
	refreshTokenSecret: string;
};

export const appModel = {
	all: async () => {
		return await App.find();
	},
	find: async (app: AppFindType) => {
		return await App.findBy(app);
	},
	create: async (app: AppCreateType) => {
		return await dataSource.createQueryBuilder().insert().into(App).values(app).execute();
	},
	update: async (id: number, app: AppUpdateType) => {
		return await App.update({ id }, app);
	},
	regenerate: async (id: number, app: AppRegenerateType) => {
		return await App.update({ id }, app);
	},
	delete: async (id: number) => {
		return await App.delete({ id });
		// const result = await App.findBy({ id });

		// if (result.length == 0) return result;

		// return await dataSource.createQueryBuilder().delete().from(App).where('id = :id', { id }).execute();
	}
};
