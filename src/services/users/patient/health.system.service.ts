import { IHealthSystemRepo } from "../../../database/repository.interfaces/users/patient/health.system.repo.interface";
import { inject, injectable } from "tsyringe";
import { HealthSystemDomainModel } from "../../../domain.types/users/patient/health.system/health.system.domain.model";
import { HealthSystemDto } from "../../../domain.types/users/patient/health.system/health.system.dto";
import { HealthSystemHospitalDto } from "../../../domain.types/users/patient/health.system/health.system.hospital.dto";
import { HealthSystemHospitalDomainModel } from
    "../../../domain.types/users/patient/health.system/health.system.hospital.domain.model";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthSystemService {

    constructor(
        @inject('IHealthSystemRepo') private _healthSystemRepo: IHealthSystemRepo,
    ) { }

    createHealthSystem = async (healthSystemDomainModel: HealthSystemDomainModel):
        Promise<HealthSystemDto> => {
        return await this._healthSystemRepo.createHealthSystem(healthSystemDomainModel);
    };

    getHealthSystems = async (): Promise<HealthSystemDto[]> => {
        return await this._healthSystemRepo.getHealthSystems();
    };

    createHealthSystemHospital = async (model: HealthSystemHospitalDomainModel):
        Promise<HealthSystemHospitalDto> => {
        return await this._healthSystemRepo.createHealthSystemHospital(model);
    };

    getHealthSystemHospitals = async (healthSystemId: uuid): Promise<HealthSystemHospitalDto[]> => {
        return await this._healthSystemRepo.getHealthSystemHospitals(healthSystemId);
    };

}
