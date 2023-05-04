import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { WearableDeviceDetailsDto } from "./webhook.wearable.device.details.dto";

export interface WearableDeviceDetailsSearchFilters extends BaseSearchFilters{
    PatientUserId?   : uuid;
    TerraUserId?     : uuid;
    Provider?        : string;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
}

export interface WearableDeviceDetailsSearchResults extends BaseSearchResults{
    Items: WearableDeviceDetailsDto[];
}

