import { OrganizationDto } from '../../domain.types/organization/organization.dto';
import { OrganizationSearchFilters, OrganizationSearchResults } from '../../domain.types/organization/organization.search.types';
import { OrganizationDomainModel } from '../../domain.types/organization/organization.domain.model';
import { AddressDto } from '../../domain.types/address/address.dto';
import { PersonDto } from '../../domain.types/person/person.dto';

////////////////////////////////////////////////////////////////////////////////////////////

export interface IOrganizationRepo {

    create(organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto>;

    getById(id: string): Promise<OrganizationDto>;

    getByContactUserId(contactUserId: string): Promise<OrganizationDto[]>;

    search(filters: OrganizationSearchFilters): Promise<OrganizationSearchResults>;

    update(id: string, organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto>;

    delete(id: string): Promise<boolean>;

    getByPersonId(personId: string): Promise<OrganizationDto[]>;

    addAddress(id: string, addressId: string): Promise<boolean>;

    removeAddress(id: string, addressId: string): Promise<boolean>;

    getAddresses(id: string): Promise<AddressDto[]>;

    addPerson(id: string, personId: string): Promise<boolean>;

    removePerson(id: string, personId: string): Promise<boolean>;

    getPersons(id: string): Promise<PersonDto[]>;

}
