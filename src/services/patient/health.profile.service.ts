import { inject, injectable } from "tsyringe";
import { IHealthProfileRepo } from "../../database/repository.interfaces/patient/health.profile.repo.interface";
import { Severity, uuid } from "../../domain.types/miscellaneous/system.types";
import { HealthProfileDomainModel } from '../../domain.types/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../domain.types/patient/health.profile/health.profile.dto';
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthProfileService  extends BaseResourceService {

    constructor(
        @inject('IHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
    ) {
        super();
    }

    getById = async (id: uuid): Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.getById(id);
    };

    create = async (healthProfileDomainModel: HealthProfileDomainModel): Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.create(healthProfileDomainModel);
    };

    getByPatientUserId = async (patientUserId: uuid): Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.getByPatientUserId(patientUserId);
    };

    updateByPatientUserId = async (patientUserId: uuid, healthProfileDomainModel: HealthProfileDomainModel)
    : Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.updateByPatientUserId(patientUserId, healthProfileDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._patientHealthProfileRepo.delete(id);
    };

    createDefault = async (patientUserId : uuid)
        : Promise<HealthProfileDto> => {
        var model = this.createDefaultHealthProfileModel(patientUserId);
        return await this._patientHealthProfileRepo.create(model);
    };

    private createDefaultHealthProfileModel = (patientUserId : uuid): HealthProfileDomainModel => {

        const model: HealthProfileDomainModel = {
            PatientUserId      : patientUserId,
            BloodGroup         : null,
            MajorAilment       : null,
            OtherConditions    : null,
            IsDiabetic         : false,
            HasHeartAilment    : false,
            MaritalStatus      : 'Unknown',
            Ethnicity          : null,
            Nationality        : null,
            Occupation         : null,
            SedentaryLifestyle : false,
            IsSmoker           : false,
            SmokingSeverity    : Severity.Low,
            SmokingSince       : null,
            IsDrinker          : false,
            DrinkingSeverity   : Severity.Low,
            DrinkingSince      : null,
            SubstanceAbuse     : false,
            ProcedureHistory   : null,
            ObstetricHistory   : null,
            OtherInformation   : null,
        };

        return model;
    }

}
