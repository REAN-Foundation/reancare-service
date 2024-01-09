import { TenantFeatureSettingDto } from "../../../../domain.types/tenant/feature.setting/tenant.setting.feature.dto";
import { TenantFeatureSettingDomainModel } from "../../../../domain.types/tenant/feature.setting/tenant.feature.setting.domain.model";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { TenantFeatureSettingSearchFilters, TenantFeatureSettingSearchResults } from "../../../../domain.types/tenant/feature.setting/tenant.feature.setting.search.type";

export interface ITenantFeatureSettingRepo {

    create(model: TenantFeatureSettingDomainModel): Promise<TenantFeatureSettingDto>;

    getById(id: uuid): Promise<TenantFeatureSettingDto>;

    update(id: uuid, model: TenantFeatureSettingDomainModel): Promise<TenantFeatureSettingDto>;

    delete(id: uuid): Promise<boolean>;

    search(filters: TenantFeatureSettingSearchFilters): Promise<TenantFeatureSettingSearchResults>;
}
