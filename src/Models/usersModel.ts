import { dataSource } from '../Connections/typeorm';
import { User } from '../Entities/usersEntity';

export type UserCreateType = {
	app: { code: string };
	id: number;
	username: string;
	email: string;
	password: string;
};

export type UserFindType = {
	id?: number;
	app: { code: string };
	username?: string;
	email?: string;
	password?: string;
	isActive?: boolean;
};

export const userModel = {
	create: async (user: UserCreateType) => {
		return await dataSource.createQueryBuilder().insert().into(User).values(user).execute();
	},
	find: async (user: UserFindType) => {
		return await User.findOneBy(user);
	}
};
