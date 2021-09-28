import { MedicationConsumptionDto } from "./medication.consumption.dto";

//////////////////////////////////////////////////////////////////////

export interface MedicationConsumptionSearchFilters {
    DrugName?     : string;
    DrugId?       : string;
    PatientUserId?: string;
    MedicationId? : string;
    DateFrom?     : Date;
    DateTo?       : Date;
    OrderBy       : string;
    Order         : string;
    PageIndex     : number;
    ItemsPerPage  : number;
}

export interface MedicationConsumptionSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : MedicationConsumptionDto[];
}
