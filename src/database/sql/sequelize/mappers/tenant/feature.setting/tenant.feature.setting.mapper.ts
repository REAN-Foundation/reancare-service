import TenantFeatureSetting from '../../../models/tenant/tenant.feature.setting.model';
import { TenantFeatureSettingDto } from '../../../../../../domain.types/tenant/feature.setting/tenant.setting.feature.dto';

///////////////////////////////////////////////////////////////////////////////////

export class TenantFeatuteSettingMapper {

    static toDto = (tenant: TenantFeatureSetting): TenantFeatureSettingDto => {
        if (tenant == null) {
            return null;
        }
        const dto: TenantFeatureSettingDto = {
            id       : tenant.id,
            TenantId : tenant.TenantId,
            Setting  : JSON.parse(tenant.Setting)
        };
        return dto;
    };

}
