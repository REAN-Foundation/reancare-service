import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { LabRecordTypeDto } from "./lab.record.type.dto";

//////////////////////////////////////////////////////////////////////

export interface LabRecordTypeSearchFilters extends BaseSearchFilters{
    TypeName?     : string;
    DisplayName?  : string;
    
}

export interface LabRecordTypeSearchResults extends BaseSearchResults{
    Items: LabRecordTypeDto[];
}
