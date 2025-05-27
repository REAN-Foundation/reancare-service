import TenantSettings from '../../models/tenant/tenant.settings.model';
import { TenantSettingsDto } from '../../../../../domain.types/tenant/tenant.settings.types';

///////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMapper {

    static toDto = (record: TenantSettings): TenantSettingsDto => {
        if (record == null) {
            return null;
        }
        const dto: TenantSettingsDto = {
            TenantId : record.TenantId,
            Common   : JSON.parse(record.Common),
            Followup : JSON.parse(record.Followup),
            ChatBot  : JSON.parse(record.ChatBot),
            Forms    : JSON.parse(record.Forms),
            Consent  : record.Consent ? JSON.parse(record.Consent) : null,
        };
        return dto;
    };

}
