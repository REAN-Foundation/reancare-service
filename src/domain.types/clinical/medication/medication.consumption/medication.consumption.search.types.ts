import { MedicationConsumptionDto } from "./medication.consumption.dto";

//////////////////////////////////////////////////////////////////////

export interface MedicationConsumptionSearchFilters {
    PatientUserId?: string;
    OrderId?      : string;
    MedicationId? : string;
    DateFrom?     : Date;
    DateTo?       : Date;
    OrderBy?       : string;
    Order?         : string;
    PageIndex?     : number;
    ItemsPerPage?  : number;
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
