import { inject, injectable } from "tsyringe";
import { IAddressRepo } from "../../database/repository.interfaces/general/address.repo.interface";
import { AddressDomainModel } from '../../domain.types/general/address/address.domain.model';
import { AddressDto } from '../../domain.types/general/address/address.dto';
import { AddressSearchResults, AddressSearchFilters } from '../../domain.types/general/address/address.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AddressService {

    constructor(
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
    ) {}

    create = async (addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        return await this._addressRepo.create(addressDomainModel);
    };

    getById = async (id: string): Promise<AddressDto> => {
        return await this._addressRepo.getById(id);
    };

    search = async (filters: AddressSearchFilters): Promise<AddressSearchResults> => {
        return await this._addressRepo.search(filters);
    };

    update = async (id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        return await this._addressRepo.update(id, addressDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._addressRepo.delete(id);
    };

}
