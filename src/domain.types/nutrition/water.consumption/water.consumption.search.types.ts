
import { WaterConsumptionDto, WaterConsumptionForDayDto } from "./water.consumption.dto";

export interface WaterConsumptionSearchFilters {
    PatientUserId?: string;
    DailyVolumeFrom?: number;
    DailyVolumeTo?: number;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface WaterConsumptionSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: WaterConsumptionDto[] | WaterConsumptionForDayDto[];
}
