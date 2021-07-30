import { inject, injectable } from "tsyringe";
import { AddressDomainModel, AddressDto, AddressSearchFilters } from "../data/domain.types/address.domain.types";
import { IAddressRepo } from "../data/repository.interfaces/address.repo.interface";

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

    getByPersonId = async (personId: string): Promise<AddressDto[]> => {
        return await this._addressRepo.getByPersonId(personId);
    };

    search = async (filters: AddressSearchFilters): Promise<AddressDto[]> => {
        return await this._addressRepo.search(filters);
    };

    update = async (id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        return await this._addressRepo.update(id, addressDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._addressRepo.delete(id);
    };
}
