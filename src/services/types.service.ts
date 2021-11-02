import { inject, injectable } from "tsyringe";
import { IRoleRepo } from "../database/repository.interfaces/role.repo.interface";
import { Gender, GenderList } from "../domain.types/miscellaneous/system.types";
import { OrganizationTypeList } from "../domain.types/organization/organization.types";
import { RoleDto } from "../domain.types/role/role.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TypesService {

    constructor(
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
    ) {}

    getPersonRoleTypes = async (): Promise<RoleDto[]> => {
        return await this._roleRepo.search();
    };

    getOrganizationTypes = async (): Promise<string[]> => {
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            resolve(OrganizationTypeList);
        });
    };

    getGenderTypes = async (): Promise<Gender[]> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            resolve(GenderList);
        });
    };

}
