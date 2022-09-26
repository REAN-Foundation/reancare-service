import { inject, injectable } from "tsyringe";
import { IRolePrivilegeRepo } from "../../database/repository.interfaces/role/role.privilege.repo.interface";
import { RolePrivilegeDto } from "../../domain.types/role/role.privilege.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class RolePrivilegeService {

    constructor(
        @inject('IRolePrivilegeRepo') private _rolePrivilegeRepo: IRolePrivilegeRepo,
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

}
