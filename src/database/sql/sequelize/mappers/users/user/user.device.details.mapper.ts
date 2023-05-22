import { UserDeviceDetailsDto } from '../../../../../../domain.types/users/user.device.details/user.device.dto';
import UserDeviceDetailsModel from '../../../models/users/user/user.device.details.model';

///////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsMapper {

    static toDto = (
        userDeviceDetails: UserDeviceDetailsModel): UserDeviceDetailsDto => {
        if (userDeviceDetails == null) {
            return null;
        }
        const dto: UserDeviceDetailsDto = {
            id          : userDeviceDetails.id,
            UserId      : userDeviceDetails.UserId,
            Token       : userDeviceDetails.Token,
            DeviceName  : userDeviceDetails.DeviceName,
            OSType      : userDeviceDetails.OSType,
            OSVersion   : userDeviceDetails.OSVersion,
            AppName     : userDeviceDetails.AppName,
            AppVersion  : userDeviceDetails.AppVersion,
            ChangeCount : userDeviceDetails.ChangeCount
        };
        return dto;
    };

}
