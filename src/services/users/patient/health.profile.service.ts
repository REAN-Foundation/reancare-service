import { Severity } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IHealthProfileRepo } from "../../../database/repository.interfaces/users/patient/health.profile.repo.interface";
import { HealthProfileDomainModel } from '../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../../domain.types/users/patient/health.profile/health.profile.dto';
import { IPatientDonorsRepo } from "../../../database/repository.interfaces/clinical/donation/patient.donors.repo.interface";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { TimeHelper } from "../../../common/time.helper";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthProfileService {

    constructor(
        @inject('IHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
        @inject('IPatientDonorsRepo') private _patientDonorsRepo: IPatientDonorsRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
    ) {}

    create = async (healthProfileDomainModel: HealthProfileDomainModel): Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.create(healthProfileDomainModel);
    };

    getByPatientUserId = async (patientUserId: string): Promise<HealthProfileDto> => {
        return await this._patientHealthProfileRepo.getByPatientUserId(patientUserId);
    };

    updateByPatientUserId = async (patientUserId: string, healthProfileDomainModel: HealthProfileDomainModel)
    : Promise<HealthProfileDto> => {
        const patientHealthProfile =
            await this._patientHealthProfileRepo.updateByPatientUserId(patientUserId, healthProfileDomainModel);
        const patientDonorsBridges = await this._patientDonorsRepo.search( { "PatientUserId": patientUserId });
        if (healthProfileDomainModel.BloodTransfusionDate) {
            for (const patientBridge of patientDonorsBridges.Items) {
                await this._patientDonorsRepo.update( patientBridge.id, { "NextDonationDate": healthProfileDomainModel.BloodTransfusionDate });
            }
            await this._patientRepo.updateByUserId( patientUserId, { "IsRemindersLoaded": false });
        }
        return patientHealthProfile;
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
            IsDiabetic         : null,
            HasHeartAilment    : null,
            MaritalStatus      : null,
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
