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

}
