import { inject, injectable } from "tsyringe";
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { AddressDomainModel, AddressDto } from "../data/domain.types/address.domain.types";
import { IRolePrivilegeRepo } from "../data/repository.interfaces/role.privilege.repo.interface";
import { RolePrivilegeDto } from "../data/domain.types/role.domain.types";

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

    delete = async (id: string): Promise<boolean> => {
        return await this._rolePrivilegeRepo.delete(id);
    };
}
