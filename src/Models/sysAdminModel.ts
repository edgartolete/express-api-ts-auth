import { dataSource } from '../Connections/typeorm';
import { SysAdmin } from '../Entities/sysAdminEntity';

export const sysAdminModel = {
	get: async () => {
		return await SysAdmin.find();
	}
};
