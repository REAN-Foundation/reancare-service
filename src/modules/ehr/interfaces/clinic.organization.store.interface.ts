import { OrganizationDomainModel } from '../../../domain.types/general/organization/organization.types';

////////////////////////////////////////////////////////////////////////////////////

export interface IClinicOrganizationStore {
    create(clinicOrganizationDomainModel: OrganizationDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: OrganizationDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
