import { PatientHealthProfileDomainModel } from "../../domain.types/patient.health.profile/patient.health.profile.domain.model";
import { PatientHealthProfileDto } from "../../domain.types/patient.health.profile/patient.health.profile.dto";

export interface IPatientHealthProfileRepo {

    create(domainModel: PatientHealthProfileDomainModel)
        : Promise<PatientHealthProfileDto>;

    getByPatientUserId(patientUserId: string): Promise<PatientHealthProfileDto>;

    updateByPatientUserId(userId: string, updateModel: PatientHealthProfileDomainModel)
        : Promise<PatientHealthProfileDto>;

    delete(id: string): Promise<boolean>;

}
