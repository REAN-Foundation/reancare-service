import { inject, injectable } from "tsyringe";
import { IUserDeviceDetailsRepo } from "../../../database/repository.interfaces/users/user/user.device.details.repo.interface ";
import { UserDeviceDetailsDomainModel } from '../../../domain.types/users/user.device.details/user.device.domain.model';
import { UserDeviceDetailsDto } from '../../../domain.types/users/user.device.details/user.device.dto';
import { UserDeviceDetailsSearchResults, UserDeviceDetailsSearchFilters } from '../../../domain.types/users/user.device.details/user.device.search.types';

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

    getByUserId = async (userId: string): Promise<UserDeviceDetailsDto[]> => {
        return await this._userDeviceDetailsRepo.getByUserId(userId);
    };

    getExistingRecord = async (deviceDetails: any): Promise<UserDeviceDetailsDto> => {
        return await this._userDeviceDetailsRepo.getExistingRecord(deviceDetails);
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

    deleteByUserId = async (userId: string): Promise<boolean> => {
        const details = await this.getByUserId(userId);
        if (details.length > 0) {
            for await (var d of details) {
                return await this._userDeviceDetailsRepo.delete(d.id);
            }
        }
        return true;
    };

}
