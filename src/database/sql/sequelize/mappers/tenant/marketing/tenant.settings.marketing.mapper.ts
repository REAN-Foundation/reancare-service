import TenantSettingsMarketing from '../../../models/tenant/marketing/tenant.settings.marketing.model';
import { TenantSettingsMarketingDto } from '../../../../../../domain.types/tenant/marketing/tenant.settings.marketing.types';
import { Logger } from '../../../../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingMapper {

    static toDto = (record: TenantSettingsMarketing): TenantSettingsMarketingDto => {
        if (record == null) {
            return null;
        }
        
        const safeJSONParse = (value: string): any => {
            if (!value) {
                return null;
            }
            try {
                return JSON.parse(value);
            } catch (error) {
                Logger.instance().error('Failed to parse marketing settings JSON.', 0, error.message);
                return null;
            }
        };

        const dto: TenantSettingsMarketingDto = {
            TenantId      : record.TenantId,
            Styling       : safeJSONParse(record.Styling),
            Content       : safeJSONParse(record.Content),
            QRcode        : safeJSONParse(record.QRcode),
            Images        : safeJSONParse(record.Images),
            Logos         : safeJSONParse(record.Logos),
            PDFResourceId : record.PDFResourceId ?? null,
        };
        return dto;
    };

}
