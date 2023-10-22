import { inject, injectable } from "tsyringe";
import { IRolePrivilegeRepo } from "../../database/repository.interfaces/role/role.privilege.repo.interface";
import { RolePrivilegeDto } from "../../domain.types/role/role.privilege.dto";
import * as RolePrivilegesList from '../../../seed.data/role.privileges.json';
import { IRoleRepo } from "../../database/repository.interfaces/role/role.repo.interface";
import { Logger } from "../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class RolePrivilegeService {

    constructor(
        @inject('IRolePrivilegeRepo') private _rolePrivilegeRepo: IRolePrivilegeRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
    ) {}

    create = async (entity: any): Promise<RolePrivilegeDto> => {
        return await this._rolePrivilegeRepo.create(entity);
    };

    getById = async (id: string): Promise<RolePrivilegeDto> => {
        return await this._rolePrivilegeRepo.getById(id);
    };

    getPrivilegesForRole = async (roleId: number): Promise<RolePrivilegeDto[]> => {
        return await this._rolePrivilegeRepo.getPrivilegesForRole(roleId);
    };

    hasPrivilegeForRole = async (roleId: number, privilege: string): Promise<boolean> => {
        return await this._rolePrivilegeRepo.hasPrivilegeForRole(roleId, privilege);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._rolePrivilegeRepo.delete(id);
    };

    seedRolePrivileges = async () => {
        try {
            const arr = RolePrivilegesList['default'];
            for (let i = 0; i < arr.length; i++) {
                const rp = arr[i];
                const roleName = rp['Role'];
                const privileges = rp['Privileges'];

                const role = await this._roleRepo.getByName(roleName);
                if (role == null) {
                    continue;
                }
                for (const privilege of privileges) {
                    const exists = await this._rolePrivilegeRepo.hasPrivilegeForRole(role.id, privilege);
                    if (!exists) {
                        await this._rolePrivilegeRepo.create({
                            RoleId    : role.id,
                            Privilege : privilege,
                        });
                    }
                }
            }
        } catch (error) {
            Logger.instance().log('Error occurred while seeding role-privileges!');
        }
        Logger.instance().log('Seeded role-privileges successfully!');
    };

}
