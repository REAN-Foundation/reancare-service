import { OrganizationDomainModel  } from '../../../domain.types/organization/organization.domain.model';
import { OrganizationSearchFilters } from '../../../domain.types/organization/organization.search.types';
////////////////////////////////////////////////////////////////////////////////////

export interface ILabOrganizationStore {
    create(labOrganizationDomainModel: OrganizationDomainModel): Promise<any>;
    search(filter: OrganizationSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: OrganizationDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
