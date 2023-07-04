import { HealthPrioritySearchFilters, HealthPrioritySearchResults } from '../../../../domain.types/users/patient/health.priority/health.priority.search.types';
import { HealthPriorityTypeDomainModel } from '../../../../domain.types/users/patient/health.priority.type/health.priority.type.domain.model';
import { HealthPriorityTypeDto } from '../../../../domain.types/users/patient/health.priority.type/health.priority.type.dto';
import { HealthPriorityDomainModel } from '../../../../domain.types/users/patient/health.priority/health.priority.domain.model';
import { HealthPriorityDto } from '../../../../domain.types/users/patient/health.priority/health.priority.dto';

export interface IHealthPriorityRepo {

    create(healthPriorityDomainModel: HealthPriorityDomainModel): Promise<HealthPriorityDto>;

    getPatientHealthPriorities(patientUserId: string): Promise<HealthPriorityDto[]>;

    getPriorityTypes(tags?: string): Promise<HealthPriorityTypeDto[]>;

    getById(id: string): Promise<HealthPriorityDto>;

    search(filters: HealthPrioritySearchFilters): Promise<HealthPrioritySearchResults>;

    update(id: string, healthPriorityDomainModel: HealthPriorityDomainModel): Promise<HealthPriorityDto>;

    totalTypesCount(): Promise<number>;

    createType(healthPriorityTypeDomainModel: HealthPriorityTypeDomainModel): Promise<HealthPriorityTypeDto>;

    getPriorityTypeById(id: string): Promise<HealthPriorityTypeDto>;

    updatePriorityType(id: string, healthPriorityTypeDomainModel: HealthPriorityTypeDomainModel):
     Promise<HealthPriorityTypeDto>;

    delete(id: string): Promise<boolean>;

    deletePriorityType(id: string): Promise<boolean>;

}
