import { OrganizationDomainModel } from '../../../domain.types/organization/organization.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IHospitalOrganizationStore {
    create(organizationDomainModel: OrganizationDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: OrganizationDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
