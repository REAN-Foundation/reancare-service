import TenantSettings from '../../models/tenant/tenant.settings.model';
import { TenantSettingsDto } from '../../../../../domain.types/tenant/tenant.settings.types';

///////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMapper {

    static toDto = (record: TenantSettings): TenantSettingsDto => {
        if (record == null) {
            return null;
        }
        const dto: TenantSettingsDto = {
            TenantId            : record.TenantId,
            HealthcareInterfaces: JSON.parse(record.HealthcareInterfaces),
            Common              : JSON.parse(record.Common),
            PatientApp          : JSON.parse(record.PatientApp),
            ChatBot             : JSON.parse(record.ChatBot),
            Forms               : JSON.parse(record.Forms),
        };
        return dto;
    };

}
