import { MedicalConditionDto } from "./medical.condition.dto";

//////////////////////////////////////////////////////////////////////

export interface MedicalConditionSearchFilters {
    Condition?: string;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface MedicalConditionSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: MedicalConditionDto[];
}
