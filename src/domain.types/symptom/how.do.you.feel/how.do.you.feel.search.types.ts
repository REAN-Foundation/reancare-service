import { HowDoYouFeelDto } from "./how.do.you.feel.dto";
import { SymptomsProgress } from "./symptom.progress.types";

//////////////////////////////////////////////////////////////////////

export interface HowDoYouFeelSearchFilters {
    Feeling?             : SymptomsProgress;
    PatientUserId?       : string;
    DateFrom?            : Date;
    DateTo?              : Date;
    OrderBy              : string;
    Order                : string;
    PageIndex            : number;
    ItemsPerPage         : number;
}

export interface HowDoYouFeelSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : HowDoYouFeelDto[];
}
