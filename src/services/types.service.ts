import { ApiError } from "../common/api.error";
import { IHealthPriorityRepo } from "../database/repository.interfaces/patient/health.priority/health.priority.repo.interface";
import { HealthPriorityTypeDto } from "../domain.types/patient/health.priority.type/health.priority.type.dto";
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
        @inject('IHealthPriorityRepo') private _healthPriorityRepo: IHealthPriorityRepo,
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

    getPriorityTypes = async (tags?: string): Promise<HealthPriorityTypeDto[]> => {
        var priorityTypes = await this._healthPriorityRepo.getPriorityTypes(tags);

        if (!priorityTypes || priorityTypes.length === 0) {
            throw new ApiError(500, 'Error while fetching priority types.');
        }

        return priorityTypes;
    };

}
