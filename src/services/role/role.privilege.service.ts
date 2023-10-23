import { inject, injectable } from "tsyringe";
import { IRolePrivilegeRepo } from "../../database/repository.interfaces/role/role.privilege.repo.interface";
import { RolePrivilegeDto } from "../../domain.types/role/role.privilege.dto";
import { IRoleRepo } from "../../database/repository.interfaces/role/role.repo.interface";
import { Logger } from "../../common/logger";
import { DefaultRoles } from "../../domain.types/role/role.types";
import * as fs from 'fs';
import * as path from 'path';
import { Helper } from "../../common/helper";

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
            var roles = DefaultRoles;
            for await (const r of roles) {
                const role = await this._roleRepo.getByName(r.Role);
                if (role == null) {
                    continue;
                }
                const seederFile = r.SeederFile;
                if (seederFile == null) {
                    continue;
                }
                var filepath = path.join(process.cwd(), 'seed.data', 'role.privileges', seederFile);
                var fileBuffer = fs.readFileSync(filepath, 'utf8');
                const privilegeMap = JSON.parse(fileBuffer);
                const privileges = Helper.convertPrivilegeMapToPrivilegeList(privilegeMap);

                for (const p of privileges) {
                    var keys = Object.keys(p);
                    var privilege = keys[0];
                    var enabled = p[privilege];

                    const rp = await this._rolePrivilegeRepo.getRolePrivilege(role.id, privilege);
                    if (rp == null) {
                        await this._rolePrivilegeRepo.create({
                            RoleId    : role.id,
                            RoleName  : role.RoleName,
                            Privilege : privilege,
                            Scope     : r.Scope,
                            Enabled   : enabled,
                        });
                    } else {
                        if (rp.Enabled !== enabled) {
                            await this._rolePrivilegeRepo.enable(rp.id, enabled);
                        }
                    }
                }
            }
        } catch (error) {
            Logger.instance().log('Error occurred while seeding role-privileges!');
        }
    };

}
