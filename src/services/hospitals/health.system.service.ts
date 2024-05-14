import { inject, injectable } from "tsyringe";
import { IHealthSystemRepo } from "../../database/repository.interfaces/hospitals/health.system.repo.interface";
import { HealthSystemDomainModel } from '../../domain.types/hospitals/health.system/health.system.domain.model';
import { HealthSystemDto } from '../../domain.types/hospitals/health.system/health.system.dto';
import { HealthSystemSearchResults, HealthSystemSearchFilters } from '../../domain.types/hospitals/health.system/health.system.search.types';
import { Logger } from "../../common/logger";
import * as seededHealthSystemsAndHospitals from '../../../seed.data/health.systems.and.hospitals.seed.json';
import { HospitalDomainModel } from "../../domain.types/hospitals/hospital/hospital.domain.model";
import { ITenantRepo } from "../../database/repository.interfaces/tenant/tenant.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthSystemService {

    constructor(
        @inject('IHealthSystemRepo') private _hospitalSystemRepo: IHealthSystemRepo,
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
    ) {}

    create = async (hospitalSystemDomainModel: HealthSystemDomainModel): Promise<HealthSystemDto> => {
        return await this._hospitalSystemRepo.create(hospitalSystemDomainModel);
    };

    getById = async (id: string): Promise<HealthSystemDto> => {
        return await this._hospitalSystemRepo.getById(id);
    };

    search = async (filters: HealthSystemSearchFilters): Promise<HealthSystemSearchResults> => {
        return await this._hospitalSystemRepo.search(filters);
    };

    update = async (id: string, hospitalSystemDomainModel: HealthSystemDomainModel): Promise<HealthSystemDto> => {
        return await this._hospitalSystemRepo.update(id, hospitalSystemDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._hospitalSystemRepo.delete(id);
    };

    getHealthSystemsWithTags = async (tags?: string): Promise<HealthSystemDto[]> => {
        return await this._hospitalSystemRepo.getHealthSystemsWithTags(tags);
    };

    public seedHealthSystemsAndHospitals = async () => {

        const arr = seededHealthSystemsAndHospitals['default'];

        Logger.instance().log('Seeding health systems and associated hospitals...');

        const tenant = await this._tenantRepo.getTenantWithCode('default');
        if (tenant == null) {
            Logger.instance().log('Default tenant not found!');
            return;
        }
        const tenantId = tenant.id;

        for (let i = 0; i < arr.length; i++) {

            var t = arr[i];

            const filters = {
                Name : t['HealthSystem']
            };

            const searchResults = await this.search(filters);
            //console.log(JSON.stringify(existingRecord, null, 2));
            if (searchResults.Items.length > 0) {
                Logger.instance().log(`Health system record ${t['HealthSystem']} already exists!`);
                continue;
            }

            const tokens = t['Tags'];
            var tags: string[] = tokens.map(x => x);

            const model: HealthSystemDomainModel = {
                Name     : t['HealthSystem'],
                TenantId : tenantId,
                Tags     : tags
            };
            var healthSystem = await this.create(model);

            for (let j = 0; j < t['AssociatedHospitals'].length; j++) {

                const entity: HospitalDomainModel = {
                    HealthSystemId : healthSystem.id,
                    TenantId       : tenantId,
                    Tags           : healthSystem.Tags,
                    Name           : t['AssociatedHospitals'][j]
                };
                await this._hospitalSystemRepo.create(entity);
            }
        }

    };

}
