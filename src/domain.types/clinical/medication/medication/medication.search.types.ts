import { MedicationDto } from "./medication.dto";

//////////////////////////////////////////////////////////////////////

export interface MedicationSearchFilters {
    DrugName?                 : string;
    PatientUserId?            : string;
    MedicalPractitionerUserId?: string;
    VisitId?                  : string;
    OrderId?                  : string;
    RefillNeeded?             : boolean;
    IsExistingMedication?     : boolean;
    StartDateFrom?            : Date;
    StartDateTo?              : Date;
    EndDateFrom?              : Date;
    EndDateTo?                : Date;
    CreatedDateFrom?          : Date;
    CreatedDateTo?            : Date;
    OrderBy                   : string;
    Order                     : string;
    PageIndex                 : number;
    ItemsPerPage              : number;
}

export interface MedicationSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : MedicationDto[];
}
