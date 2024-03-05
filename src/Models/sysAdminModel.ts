import { dataSource } from '../Connections/typeorm';
import { SysAdmin } from '../Entities/sysAdminEntity';

export const sysAdminModel = {
	get: async () => {
		return await dataSource.createQueryBuilder().select().from(SysAdmin, 'sysadmin').execute();
	},
	updateUserName: async(username: string) => {
		return await dataSource.createQueryBuilder().update({username})
	}
};
