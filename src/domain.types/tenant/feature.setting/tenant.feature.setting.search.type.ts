import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { TenantFeatureSettingDto } from "../feature.setting/tenant.setting.feature.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface TenantFeatureSettingSearchFilters extends BaseSearchFilters {
    TenantId? : string;
}

export interface TenantFeatureSettingSearchResults extends BaseSearchResults {
    Items : TenantFeatureSettingDto[];
}
