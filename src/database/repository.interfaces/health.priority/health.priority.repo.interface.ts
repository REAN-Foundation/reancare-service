import { HealthPriorityTypeDomainModel } from '../../../domain.types/health.priority.type/health.priority.type.domain.model';
import { HealthPriorityTypeDto } from '../../../domain.types/health.priority.type/health.priority.type.dto';
import { HealthPriorityDomainModel } from '../../../domain.types/health.priority/health.priority.domain.model';
import { HealthPriorityDto } from '../../../domain.types/health.priority/health.priority.dto';

export interface IHealthPriorityRepo {

    create(healthPriorityDomainModel: HealthPriorityDomainModel): Promise<HealthPriorityDto>;

    getAll(healthPriorityDomainModel: HealthPriorityDomainModel): Promise<HealthPriorityDto[]>;

    getPriorityTypes(): Promise<HealthPriorityTypeDto[]>;

    getById(id: string): Promise<HealthPriorityDto>;

    totalTypesCount(): Promise<number>;

    createType(healthPriorityTypeDomainModel: HealthPriorityTypeDomainModel): Promise<HealthPriorityTypeDto>;

}
