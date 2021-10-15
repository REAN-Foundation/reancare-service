import { DocumentDto } from "./document.dto";

//////////////////////////////////////////////////////////////////////

export interface DocumentSearchFilters {
    DocumentType?             : string;
    PatientUserId?            : string;
    MedicalPractitionerUserId?: string;
    AssociatedVisitId?        : string;
    AssociatedOrderId?        : string;
    CreatedDateFrom?          : Date;
    CreatedDateTo?            : Date;
    OrderBy?                  : string;
    Order?                    : string;
    PageIndex?                : number;
    ItemsPerPage?             : number;
}

export interface DocumentSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : DocumentDto[];
}
