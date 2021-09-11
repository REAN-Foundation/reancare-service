import { inject, injectable } from "tsyringe";
import { IPatientHealthProfileRepo } from "../database/repository.interfaces/patient.health.profile.repo.interface";
import { PatientHealthProfileDomainModel } from '../domain.types/patient.health.profile/patient.health.profile.domain.model';
import { PatientHealthProfileDto } from '../domain.types/patient.health.profile/patient.health.profile.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PatientHealthProfileService {

    constructor(
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IPatientHealthProfileRepo,
    ) {}

    create = async (healthProfileDomainModel: PatientHealthProfileDomainModel): Promise<PatientHealthProfileDto> => {
        return await this._patientHealthProfileRepo.create(healthProfileDomainModel);
    };

    getByPatientUserId = async (patientUserId: string): Promise<PatientHealthProfileDto> => {
        return await this._patientHealthProfileRepo.getByPatientUserId(patientUserId);
    };

    updateByPatientUserId = async (patientUserId: string, healthProfileDomainModel: PatientHealthProfileDomainModel)
    : Promise<PatientHealthProfileDto> => {
        return await this._patientHealthProfileRepo.updateByPatientUserId(patientUserId, healthProfileDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._patientHealthProfileRepo.delete(id);
    };

    createDefault = async (patientUserId : string)
        : Promise<PatientHealthProfileDto> => {
        var model = this.createDefaultHealthProfileModel(patientUserId);
        return await this._patientHealthProfileRepo.create(model);
    };

    private createDefaultHealthProfileModel = (patientUserId : string): PatientHealthProfileDomainModel => {

        const model: PatientHealthProfileDomainModel = {
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
            SmokingSeverity    : 'Low',
            SmokingSince       : null,
            IsDrinker          : false,
            DrinkingSeverity   : 'Low',
            DrinkingSince      : null,
            SubstanceAbuse     : false,
            ProcedureHistory   : null,
            ObstetricHistory   : null,
            OtherInformation   : null,
        };

        return model;
    }

}
