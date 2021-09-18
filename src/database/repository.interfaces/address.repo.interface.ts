import { AddressDomainModel } from "../../domain.types/address/address.domain.model";
import { AddressDto } from "../../domain.types/address/address.dto";
import { AddressSearchFilters, AddressSearchResults } from "../../domain.types/address/address.search.types";

export interface IAddressRepo {

    create(addressDomainModel: AddressDomainModel): Promise<AddressDto>;

    getById(id: string): Promise<AddressDto>;

    search(filters: AddressSearchFilters): Promise<AddressSearchResults>;

    update(id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto>;

    delete(id: string): Promise<boolean>;

}
