import { dataSource } from '../Connections/typeorm';
import { SysAdmin } from '../Entities/sysAdminEntity';

export const sysAdminModel = {
	get: async () => {
		return await dataSource.createQueryBuilder().select().from(SysAdmin, 'sysadmin').execute();
	},
	updateUserName: async (userId: number, username: string) => {
		return await SysAdmin.update({ id: userId }, { username });
	},
	updatePassword: async (userId: number, password: string) => {
		return await SysAdmin.update({ id: userId }, { password });
	}
};
