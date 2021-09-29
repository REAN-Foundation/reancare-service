import UserDeviceDetailsModel from '../models/user.device.details.model';
import { UserDeviceDetailsDto } from '../../../../domain.types/user.device.details/user.device.dto';

///////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsMapper {

    static toDto = (
        userDeviceDetails: UserDeviceDetailsModel): UserDeviceDetailsDto => {
        if (userDeviceDetails == null) {
            return null;
        }
        const dto: UserDeviceDetailsDto = {
            id         : userDeviceDetails.id,
            UserId     : userDeviceDetails.UserId,
            Token      : userDeviceDetails.Token,
            DeviceName : userDeviceDetails.DeviceName,
            OSType     : userDeviceDetails.OSType,
            OSVersion  : userDeviceDetails.OSVersion,
            AppName    : userDeviceDetails.AppName,
            AppVersion : userDeviceDetails.AppVersion
        };
        return dto;
    }

}
