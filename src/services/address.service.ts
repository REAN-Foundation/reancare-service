import { inject, injectable } from "tsyringe";
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { AddressDomainModel, AddressDto } from "../data/domain.types/address.domain.types";
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

    getByUserId = async (userId: string): Promise<AddressDto> => {
        return await this._addressRepo.getByUserId(userId);
    };

    update = async (id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        return await this._addressRepo.update(id, addressDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._addressRepo.delete(id);
    };
}
