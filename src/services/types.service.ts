import { OrganizationTypeList } from "../domain.types/organization/organization.types";
import { inject, injectable } from "tsyringe";
import { IRoleRepo } from "../database/repository.interfaces/role.repo.interface";
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

    getGenderTypes = async (): Promise<string[]> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            resolve([
                'Male',
                'Female',
                'Other',
                'Unknown'
            ]);
        });
    };

}
