import { AddressDomainModel, AddressDto } from '../domain.types/address.domain.types';

export interface IAddressRepo {

    create(addressDomainModel: AddressDomainModel): Promise<AddressDto>;

    getById(id: string): Promise<AddressDto>;

    getByUserId(userId: string): Promise<AddressDto>;

    update(id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto>;

    delete(id: string): Promise<boolean>;

}
