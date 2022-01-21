import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/careplan/careplan.repo.interface";
import { IPatientRepo } from "../../database/repository.interfaces/patient/patient.repo.interface";
import { ApiError } from "../../common/api.error";
import { IPersonRepo } from "../../database/repository.interfaces/person.repo.interface";
import { IUserRepo } from "../../database/repository.interfaces/user/user.repo.interface";
import { CareplanHandler } from '../../modules/careplan/careplan.handler';
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { UserTaskCategory } from "../../domain.types/user/user.task/user.task..types";
import { UserActionType } from "../../domain.types/user/user.task/user.task..types";
import { TimeHelper } from "../../common/time.helper";
import { IUserTaskRepo } from "../../database/repository.interfaces/user/user.task.repo.interface";
import { DurationType } from "../../domain.types/miscellaneous/time.types";
import { Logger } from "../../common/logger";
import { HealthPriorityDto } from "../../domain.types/health.priority/health.priority.dto";
import { HealthPriorityDomainModel } from "../../domain.types/health.priority/health.priority.domain.model";
import { HealthPriority } from "../../domain.types/health.priority/health.priority";
import { IHealthPriorityRepo } from "../../database/repository.interfaces/health.priority/health.priority.repo.interface";
import { HealthPriorityTypeDomainModel } from "../../domain.types/health.priority.type/health.priority.type.domain.model";
import { HealthPriorityTypeDto } from "../../domain.types/health.priority.type/health.priority.type.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthPriorityService {

    _handler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IHealthPriorityRepo') private _healthPriorityRepo: IHealthPriorityRepo,

    ) {}

    create = async (model: HealthPriorityDomainModel): Promise<HealthPriorityDto> => {
        return await this._healthPriorityRepo.create(model);
    };

    getPriorities = async (model: HealthPriorityDomainModel): Promise<HealthPriorityDto[]> => {

        var patient = await this.getPatient(model.PatientUserId);
        if (!patient) {
            throw new Error('Patient does not exist!');
        }

        var priorities = await this._healthPriorityRepo.getAll(model);

        if (!priorities) {
            throw new ApiError(500, 'Error while fetching priorities for given patient');
        }

        return priorities;
    };
    
    getPriorityTypes = async (): Promise<HealthPriorityTypeDto[]> => {
        var priorityTypes = await this._healthPriorityRepo.getPriorityTypes();

        if (!priorityTypes || priorityTypes.length === 0) {
            throw new ApiError(500, 'Error while fetching priority types.');
        }

        return priorityTypes;
    };

    createType = async (domainModel: HealthPriorityTypeDomainModel): Promise<HealthPriorityTypeDto> => {
        return await this._healthPriorityRepo.createType(domainModel);
    };

    private async getPatient(patientUserId: uuid) {

        var patientDto = await this._patientRepo.getByUserId(patientUserId);

        var user = await this._userRepo.getById(patientDto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        patientDto.User = user;
        return patientDto;
    }

}
