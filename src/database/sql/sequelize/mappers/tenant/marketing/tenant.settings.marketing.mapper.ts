import TenantSettingsMarketing from '../../../models/tenant/marketing/tenant.settings.marketing.model';
import { TenantSettingsMarketingDto } from '../../../../../../domain.types/tenant/marketing/tenant.settings.marketing.types';
///////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingMapper {

    static toDto = (record: TenantSettingsMarketing): TenantSettingsMarketingDto => {
        if (record == null) {
            return null;
        }
        
        const dto: TenantSettingsMarketingDto = {
            TenantId      : record.TenantId,
            Styling       : record.Styling ? JSON.parse(record.Styling) : null,
            Content       : record.Content ? JSON.parse(record.Content) : null,
            QRCode        : record.QRcode ? JSON.parse(record.QRcode) : null,
            Images        : record.Images ? JSON.parse(record.Images) : null,
            Logos         : record.Logos ? JSON.parse(record.Logos) : null,
            PDFResourceId : record.PDFResourceId ?? null,
        };
        return dto;
    };

}
