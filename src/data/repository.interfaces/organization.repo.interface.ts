import { OrganizationDomainModel, OrganizationDto, OrganizationSearchFilters, OrganizationSearchResults } from '../domain.types/organization.domain.types';

export interface IOrganizationRepo {

    create(organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto>;

    getById(id: string): Promise<OrganizationDto>;

    getByContactUserId(contactUserId: string): Promise<OrganizationDto[]>;

    search(filters: OrganizationSearchFilters): Promise<OrganizationSearchResults>;

    update(id: string, organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto>;

    delete(id: string): Promise<boolean>;

}
