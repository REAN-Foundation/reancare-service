import { HealthProfileDomainModel } from "../../../../domain.types/users/patient/health.profile/health.profile.domain.model";
import { HealthProfileDto } from "../../../../domain.types/users/patient/health.profile/health.profile.dto";

export interface IHealthProfileRepo {

    create(domainModel: HealthProfileDomainModel)
        : Promise<HealthProfileDto>;

    getByPatientUserId(patientUserId: string): Promise<HealthProfileDto>;

    updateByPatientUserId(userId: string, updateModel: HealthProfileDomainModel)
        : Promise<HealthProfileDto>;

    deleteByPatientUserId(id: string): Promise<boolean>;

}
