import { AddressDomainModel, AddressDto, AddressSearchFilters } from '../domain.types/address.domain.types';

export interface IAddressRepo {

    create(addressDomainModel: AddressDomainModel): Promise<AddressDto>;

    getById(id: string): Promise<AddressDto>;

    getByPersonId(personId: string): Promise<AddressDto[]>;

    search(filters: AddressSearchFilters): Promise<AddressDto[]>;

    update(id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto>;

    delete(id: string): Promise<boolean>;

}
