import { Severity } from "../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IHealthProfileRepo } from "../../database/repository.interfaces/patient/health.profile.repo.interface";
import { HealthProfileDomainModel } from '../../domain.types/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../domain.types/patient/health.profile/health.profile.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthProfileService {

    constructor(
        @inject('IHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
    ) {}

    create = async (healthProfileDomainModel: HealthProfileDomainModel): Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.create(healthProfileDomainModel);
    };

    getByPatientUserId = async (patientUserId: string): Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.getByPatientUserId(patientUserId);
    };

    updateByPatientUserId = async (patientUserId: string, healthProfileDomainModel: HealthProfileDomainModel)
    : Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.updateByPatientUserId(patientUserId, healthProfileDomainModel);
    };

    deleteByPatientUserId = async (patientUserId: string): Promise<boolean> => {
        return await this._patientHealthProfileRepo.deleteByPatientUserId(patientUserId);
    };

    createDefault = async (patientUserId : string)
        : Promise<HealthProfileDto> => {
        var model = this.createDefaultHealthProfileModel(patientUserId);
        return await this._patientHealthProfileRepo.create(model);
    };

    private createDefaultHealthProfileModel = (patientUserId : string): HealthProfileDomainModel => {

        const model: HealthProfileDomainModel = {
            PatientUserId      : patientUserId,
            BloodGroup         : null,
            MajorAilment       : null,
            OtherConditions    : null,
            IsDiabetic         : false,
            HasHeartAilment    : false,
            MaritalStatus      : 'Unknown',
            Ethnicity          : null,
            Race               : null,
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
    };

}
