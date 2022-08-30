import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { LabRecordDto } from "./lab.record.dto";

//////////////////////////////////////////////////////////////////////

export interface LabRecordSearchFilters extends BaseSearchFilters{
    PatientUserId? : uuid;
    TypeId?        : uuid;
    TypeName?      : string;
    DisplayName?   : string;
    DateFrom?      : Date;
    DateTo?        : Date;
}

export interface LabRecordSearchResults extends BaseSearchResults{
    Items: LabRecordDto[];
}
