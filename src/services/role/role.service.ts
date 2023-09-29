import { inject, injectable } from "tsyringe";
import { IRoleRepo } from "../../database/repository.interfaces/role/role.repo.interface";
import { RoleDto } from "../../domain.types/role/role.dto";
import { RoleSearchFilters } from "../../domain.types/role/role.domain.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class RoleService {

    constructor(
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
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

    search = async (filters: RoleSearchFilters): Promise<RoleDto[]> => {
        return await this._roleRepo.search(filters);
    };

    searchByName = async (name: string): Promise<RoleDto[]> => {
        return await this._roleRepo.searchByName(name);
    };

    update = async (id: number, entity: any): Promise<RoleDto> => {
        return await this._roleRepo.update(id, entity);
    };

}
