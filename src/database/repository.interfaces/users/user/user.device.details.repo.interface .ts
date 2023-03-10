import { UserDeviceDetailsDomainModel } from "../../../../domain.types/users/user.device.details/user.device.domain.model";
import { UserDeviceDetailsDto } from "../../../../domain.types/users/user.device.details/user.device.dto";
import { UserDeviceDetailsSearchFilters, UserDeviceDetailsSearchResults } from "../../../../domain.types/users/user.device.details/user.device.search.types";

export interface IUserDeviceDetailsRepo {

    create(userDeviceDetailsDomainModel: UserDeviceDetailsDomainModel): Promise<UserDeviceDetailsDto>;

    getById(id: string): Promise<UserDeviceDetailsDto>;

    getByUserId(userId: string): Promise<UserDeviceDetailsDto[]>;

    getExistingRecord(deviceDetails: any): Promise<UserDeviceDetailsDto>;

    search(filters: UserDeviceDetailsSearchFilters): Promise<UserDeviceDetailsSearchResults>;

    update(id: string, userDeviceDetailsDomainModel: UserDeviceDetailsDomainModel):
    Promise<UserDeviceDetailsDto>;

    delete(id: string): Promise<boolean>;

}
