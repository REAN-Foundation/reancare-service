import { OrganizationDomainModel } from '../../../domain.types/general/organization/organization.types';

////////////////////////////////////////////////////////////////////////////////////

export interface IPharmacyOrganizationStore {
    create(pharmacyOrganizationDomainModel: OrganizationDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: OrganizationDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
