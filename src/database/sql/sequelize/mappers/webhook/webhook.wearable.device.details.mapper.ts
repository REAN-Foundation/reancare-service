import { WearableDeviceDetailsDto } from '../../../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.dto';
import { WearableDeviceDetailsDomainModel } from '../../../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.domain.model';

///////////////////////////////////////////////////////////////////////////////////

export class WearableDeviceDetailsMapper {

    static toDto = (wearableDeviceDetailsDomainModel: WearableDeviceDetailsDomainModel): WearableDeviceDetailsDto => {
       
        const dto: WearableDeviceDetailsDto = {
            id                : wearableDeviceDetailsDomainModel.id,
            PatientUserId     : wearableDeviceDetailsDomainModel.PatientUserId,
            Provider          : wearableDeviceDetailsDomainModel.Provider,
            TerraUserId       : wearableDeviceDetailsDomainModel.TerraUserId,
            Scopes            : wearableDeviceDetailsDomainModel.Scopes,
            AuthenticatedAt   : wearableDeviceDetailsDomainModel.AuthenticatedAt,
            DeauthenticatedAt : wearableDeviceDetailsDomainModel.DeauthenticatedAt
        };
        return dto;
    };

}
