import { OrganizationDomainModel  } from '../../../domain.types/general/organization/organization.domain.model';
////////////////////////////////////////////////////////////////////////////////////

export interface ILabOrganizationStore {
    create(labOrganizationDomainModel: OrganizationDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: OrganizationDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
