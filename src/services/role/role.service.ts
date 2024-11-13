import { inject, injectable } from "tsyringe";
import { IRoleRepo } from "../../database/repository.interfaces/role/role.repo.interface";
import { RoleDto } from "../../domain.types/role/role.dto";
import { Logger } from "../../common/logger";
import { DefaultRoles } from "../../domain.types/role/role.types";
import { ITenantRepo } from "../../database/repository.interfaces/tenant/tenant.repo.interface";
import { RoleSearchResults, RoleSearchFilters } from "../../domain.types/role/role.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class RoleService {

    constructor(
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
    ) {}

    create = async (entity: any): Promise<RoleDto> => {
        return await this._roleRepo.create(entity);
    };

    getById = async (id: number): Promise<RoleDto> => {
        return await this._roleRepo.getById(id);
    };

    getByName = async (name: string): Promise<RoleDto> => {
        return await this._roleRepo.getByName(name);
    };

    delete = async (id: number): Promise<boolean> => {
        return await this._roleRepo.delete(id);
    };

    search = async (filters: RoleSearchFilters): Promise<RoleSearchResults> => {
        return await this._roleRepo.search(filters);
    };

    searchByName = async (name: string): Promise<RoleDto[]> => {
        return await this._roleRepo.searchByName(name);
    };

    update = async (id: number, entity: any): Promise<RoleDto> => {
        return await this._roleRepo.update(id, entity);
    };

    seedDefaultRoles = async (): Promise<boolean> => {

        const defaultTenant = await this._tenantRepo.getTenantWithCode('default');
        if (defaultTenant == null) {
            return;
        }

        for await (const r of DefaultRoles) {
            const role = await this._roleRepo.getByName(r.Role);
            if (role == null) {
                await this._roleRepo.create({
                    RoleName      : r.Role,
                    Description   : r.Description,
                    TenantId      : defaultTenant.id,
                    IsSystemRole  : r.IsSystemRole,
                    IsUserRole    : r.IsUserRole,
                    IsDefaultRole : true,
                });
            }
        }

        Logger.instance().log('Seeded default roles successfully!');
        return true;
    };

}
