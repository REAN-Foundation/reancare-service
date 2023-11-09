import { HealthSystemDomainModel } from "../../../domain.types/hospitals/health.system/health.system.domain.model";
import { HealthSystemDto } from "../../../domain.types/hospitals/health.system/health.system.dto";
import { HealthSystemSearchFilters, HealthSystemSearchResults } from "../../../domain.types/hospitals/health.system/health.system.search.types";

export interface IHealthSystemRepo {

    create(model: HealthSystemDomainModel): Promise<HealthSystemDto>;

    getById(id: string): Promise<HealthSystemDto>;

    search(filters: HealthSystemSearchFilters): Promise<HealthSystemSearchResults>;

    update(id: string, model: HealthSystemDomainModel): Promise<HealthSystemDto>;

    delete(id: string): Promise<boolean>;

    getHealthSystemsWithTags(tags?: string): Promise<HealthSystemDto[]>;

}
