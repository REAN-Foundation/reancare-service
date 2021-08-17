import { AddressDomainModel, AddressDto, AddressSearchFilters, AddressSearchResults } from '../../domain.types/address.domain.types';

export interface IAddressRepo {

    create(addressDomainModel: AddressDomainModel): Promise<AddressDto>;

    getById(id: string): Promise<AddressDto>;

    getByPersonId(personId: string): Promise<AddressDto[]>;

    getByOrganizationId(organizationId: string): Promise<AddressDto[]>;

    search(filters: AddressSearchFilters): Promise<AddressSearchResults>;

    update(id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto>;

    delete(id: string): Promise<boolean>;

}
