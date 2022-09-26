import { inject, injectable } from "tsyringe";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { ApiError } from "../../../common/api.error";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { CareplanHandler } from '../../../modules/careplan/careplan.handler';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { HealthPriorityDto } from "../../../domain.types/users/patient/health.priority/health.priority.dto";
import { HealthPriorityDomainModel } from "../../../domain.types/users/patient/health.priority/health.priority.domain.model";
import { IHealthPriorityRepo } from "../../../database/repository.interfaces/users/patient/health.priority.repo.interface";
import { HealthPriorityTypeDomainModel } from "../../../domain.types/users/patient/health.priority.type/health.priority.type.domain.model";
import { HealthPriorityTypeDto } from "../../../domain.types/users/patient/health.priority.type/health.priority.type.dto";
import { HealthPrioritySearchFilters, HealthPrioritySearchResults } from "../../../domain.types/users/patient/health.priority/health.priority.search.types";

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

    getPatientHealthPriorities = async (patientUserId: string): Promise<HealthPriorityDto[]> => {

        var patient = await this.getPatient(patientUserId);
        if (!patient) {
            throw new Error('Patient does not exist!');
        }

        var priorities = await this._healthPriorityRepo.getPatientHealthPriorities(patientUserId);

        if (!priorities) {
            throw new ApiError(500, 'Error while fetching priorities for given patient');
        }

        return priorities;
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

    getById = async (id: uuid): Promise<HealthPriorityDto> => {
        return await this._healthPriorityRepo.getById(id);
    };

    search = async (filters: HealthPrioritySearchFilters): Promise<HealthPrioritySearchResults> => {
        return await this._healthPriorityRepo.search(filters);
    };

    update = async (id: uuid, healthPriorityDomainModel: HealthPriorityDomainModel): Promise<HealthPriorityDto> => {
        var dto = await this._healthPriorityRepo.update(id, healthPriorityDomainModel);
        if (dto.Status === 'COMPLETED' && dto.Provider) {

            await this._handler.updateHealthPriority(dto.PatientUserId,
                dto.Provider, dto.ProviderCareplanCode,
                dto.ProviderEnrollmentId, dto.HealthPriorityType.replace(" ", ""));
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._healthPriorityRepo.delete(id);
    };

}
