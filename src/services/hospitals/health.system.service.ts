import { inject, injectable } from "tsyringe";
import { IHealthSystemRepo } from "../../database/repository.interfaces/hospitals/health.system.repo.interface";
import { HealthSystemDomainModel } from '../../domain.types/hospitals/health.system/health.system.domain.model';
import { HealthSystemDto } from '../../domain.types/hospitals/health.system/health.system.dto';
import { HealthSystemSearchResults, HealthSystemSearchFilters } from '../../domain.types/hospitals/health.system/health.system.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthSystemService {

    constructor(
        @inject('IHealthSystemRepo') private _hospitalSystemRepo: IHealthSystemRepo,
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

}
