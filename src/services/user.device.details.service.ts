import { inject, injectable } from "tsyringe";
import { IUserDeviceDetailsRepo } from "../database/repository.interfaces/user.device.details.repo.interface ";
import { UserDeviceDetailsDomainModel } from '../domain.types/user.device.details/user.device.domain.model';
import { UserDeviceDetailsDto } from '../domain.types/user.device.details/user.device.dto';
import { UserDeviceDetailsSearchResults, UserDeviceDetailsSearchFilters } from '../domain.types/user.device.details/user.device.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserDeviceDetailsService {

    constructor(
        @inject('IUserDeviceDetailsRepo') private _userDeviceDetailsRepo: IUserDeviceDetailsRepo,
    ) { }

    create = async (userDeviceDetailsDomainModel: UserDeviceDetailsDomainModel):
    Promise<UserDeviceDetailsDto> => {
        return await this._userDeviceDetailsRepo.create(userDeviceDetailsDomainModel);
    };

    getById = async (id: string): Promise<UserDeviceDetailsDto> => {
        return await this._userDeviceDetailsRepo.getById(id);
    };

    search = async (filters: UserDeviceDetailsSearchFilters): Promise<UserDeviceDetailsSearchResults> => {
        return await this._userDeviceDetailsRepo.search(filters);
    };

    update = async (id: string, userDeviceDetailsDomainModel: UserDeviceDetailsDomainModel):
    Promise<UserDeviceDetailsDto> => {
        return await this._userDeviceDetailsRepo.update(id, userDeviceDetailsDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._userDeviceDetailsRepo.delete(id);
    };

}

