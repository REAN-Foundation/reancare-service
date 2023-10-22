import { IHealthSystemRepo } from "../../../database/repository.interfaces/users/patient/health.system.repo.interface";
import { inject, injectable } from "tsyringe";
import { HealthSystemDomainModel } from "../../../domain.types/users/patient/health.system/health.system.domain.model";
import { HealthSystemDto } from "../../../domain.types/users/patient/health.system/health.system.dto";
import { HealthSystemHospitalDto } from "../../../domain.types/users/patient/health.system/health.system.hospital.dto";
import { HealthSystemHospitalDomainModel }
    from "../../../domain.types/users/patient/health.system/health.system.hospital.domain.model";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { HealthSystemSearchFilters, HealthSystemSearchResults }
    from "../../../domain.types/users/patient/health.system/health.system.search.types";
import { Logger } from "../../../common/logger";
import * as seededHealthSystemsAndHospitals from '../../../../seed.data/health.systems.and.hospitals.seed..json';

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

    getHealthSystems = async (planName?: string): Promise<HealthSystemDto[]> => {
        return await this._healthSystemRepo.getHealthSystems(planName);
    };

    createHealthSystemHospital = async (model: HealthSystemHospitalDomainModel):
        Promise<HealthSystemHospitalDto> => {
        return await this._healthSystemRepo.createHealthSystemHospital(model);
    };

    getHealthSystemHospitals = async (healthSystemId: uuid): Promise<HealthSystemHospitalDto[]> => {
        return await this._healthSystemRepo.getHealthSystemHospitals(healthSystemId);
    };

    searchType = async (filters: HealthSystemSearchFilters): Promise<HealthSystemSearchResults> => {
        return await this._healthSystemRepo.searchType(filters);
    };

    seedHealthSystemsAndHospitals = async () => {

        const arr = seededHealthSystemsAndHospitals['default'];

        Logger.instance().log('Seeding health systems and associated hospitals...');

        for (let i = 0; i < arr.length; i++) {

            var t = arr[i];

            const filters = {
                Name : t['HealthSystem']
            };

            const existingRecord = await this._healthSystemRepo.searchType(filters);
            //console.log(JSON.stringify(existingRecord, null, 2));
            if (existingRecord.Items.length > 0) {
                Logger.instance().log(`Health system record ${t['HealthSystem']} already exists!`);
                continue;
            }

            const tokens = t['Tags'];
            var tags: string[] = tokens.map(x => x);

            const model: HealthSystemDomainModel = {
                Name : t['HealthSystem'],
                Tags : tags
            };
            var healthSystem = await this._healthSystemRepo.createHealthSystem(model);

            for (let j = 0; j < t['AssociatedHospitals'].length; j++) {

                const entity: HealthSystemHospitalDomainModel = {
                    HealthSystemId : healthSystem.id,
                    Tags           : healthSystem.Tags,
                    Name           : t['AssociatedHospitals'][j]
                };
                await this._healthSystemRepo.createHealthSystemHospital(entity);

            }
        }

    };

}
