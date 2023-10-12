import { ApiError } from "../../common/api.error";
import { IHealthPriorityRepo } from "../../database/repository.interfaces/users/patient/health.priority.repo.interface";
import { HealthPriorityTypeDto } from "../../domain.types/users/patient/health.priority.type/health.priority.type.dto";
import { inject, injectable } from "tsyringe";
import { IRoleRepo } from "../../database/repository.interfaces/role/role.repo.interface";
import { Gender, GenderList } from "../../domain.types/miscellaneous/system.types";
import { OrganizationTypeList } from "../../domain.types/general/organization/organization.types";
import { RoleDto } from "../../domain.types/role/role.dto";
import { LabRecordTypeDto } from "../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.dto";
import { ILabRecordRepo } from "../../database/repository.interfaces/clinical/lab.record/lab.record.interface";
import { HealthPriorityTypeDomainModel } from "../../domain.types/users/patient/health.priority.type/health.priority.type.domain.model";
import { RoleDomainModel } from "../../domain.types/role/role.domain.model";
import { LabRecordTypeDomainModel } from "../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.domain.model";
import { IGoalRepo } from "../../database/repository.interfaces/users/patient/goal.repo.interface";
import { GoalTypeDto } from "../../domain.types/users/patient/goal.type/goal.type.dto";
import { GoalTypeDomainModel } from "../../domain.types/users/patient/goal.type/goal.type.domain.model";
import { QueryResponseTypeList } from "../../domain.types/clinical/assessment/assessment.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TypesService {

    constructor(
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IHealthPriorityRepo') private _healthPriorityRepo: IHealthPriorityRepo,
        @inject('ILabRecordRepo') private _labRecordTypeRepo: ILabRecordRepo,
        @inject('IGoalRepo') private _goalTypeRepo: IGoalRepo,
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

    getQueryResponseTypes = async (): Promise<string[]> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            resolve(QueryResponseTypeList);
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

    getLabRecordTypes = async (displayName?: string): Promise<LabRecordTypeDto[]> => {
        var labRecordTypes = await this._labRecordTypeRepo.getLabRecordTypes(displayName);

        if (!labRecordTypes || labRecordTypes.length === 0) {
            throw new ApiError(500, 'Error while fetching lab record types.');
        }

        return labRecordTypes;
    };

    // Priority type

    createPriorityType = async (healthPriorityTypeDomainModel: HealthPriorityTypeDomainModel):
     Promise<HealthPriorityTypeDto> => {
        return await this._healthPriorityRepo.createType(healthPriorityTypeDomainModel);
    };

    getPriorityTypeById = async (id: string): Promise<HealthPriorityTypeDto> => {
        return await this._healthPriorityRepo.getPriorityTypeById(id);
    };

    updatePriorityType = async (id: string, healthPriorityTypeDomainModel: HealthPriorityTypeDomainModel):
     Promise<HealthPriorityTypeDto> => {
        return await this._healthPriorityRepo.updatePriorityType(id, healthPriorityTypeDomainModel);
    };

    deletePriorityType = async (id: string): Promise<boolean> => {
        return await this._healthPriorityRepo.deletePriorityType(id);
    };

    //Role type

    createRoleType = async (roleDomainModel: RoleDomainModel): Promise<RoleDto> => {
        return await this._roleRepo.create(roleDomainModel);
    };

    getRoleTypeById = async (id: number): Promise<RoleDto> => {
        return await this._roleRepo.getById(id);
    };

    updateRoleType = async (id: number, roleDomainModel: RoleDomainModel):Promise<RoleDto> => {
        return await this._roleRepo.update(id, roleDomainModel);
    };

    deleteRoleType = async (id: number): Promise<boolean> => {
        return await this._roleRepo.delete(id);
    };

    //Lab record

    createLabRecordType = async (labRecordTypeDomainModel: LabRecordTypeDomainModel): Promise<LabRecordTypeDto> => {
        return await this._labRecordTypeRepo.createType(labRecordTypeDomainModel);
    };

    getLabRecordTypeById = async (id: string): Promise<LabRecordTypeDto> => {
        return await this._labRecordTypeRepo.getLabRecordTypeById(id);
    };

    updateLabRecordType = async (id: string, labRecordTypeDomainModel: LabRecordTypeDomainModel):
    Promise<LabRecordTypeDto> => {
        return await this._labRecordTypeRepo.updateLabRecordType(id, labRecordTypeDomainModel);
    };

    deleteLabRecordType = async (id: string): Promise<boolean> => {
        return await this._labRecordTypeRepo.deleteLabRecordType(id);
    };

    //Goal type

    createGoalType = async (goalTypeDomainModel: GoalTypeDomainModel): Promise<GoalTypeDto> => {
        return await this._goalTypeRepo.createGoalType(goalTypeDomainModel);
    };

    getGoalTypeById = async (id: string): Promise<GoalTypeDto> => {
        return await this._goalTypeRepo.getGoalTypeById(id);
    };

    getGoalTypes = async (tags?: string): Promise<GoalTypeDto[]> => {
        var goalTypes = await this._goalTypeRepo.getGoalTypes(tags);
        return goalTypes;
    };

    updateGoalType = async (id: string, goalTypeDomainModel: GoalTypeDomainModel):
    Promise<GoalTypeDto> => {
        return await this._goalTypeRepo.updateGoalType(id, goalTypeDomainModel);
    };

    deleteGoalType = async (id: string): Promise<boolean> => {
        return await this._goalTypeRepo.deleteGoalType(id);
    };

}
