import { OrderDto } from "./order.dto";
import { OrderStates } from "./order.types";

//////////////////////////////////////////////////////////////////////

export interface OrderSearchFilters {
    Type?: string;
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    ReferenceOrderId?: string;
    FulfilledByUserId?: string;
    FulfilledByOrganizationId?: string;
    CurrentState?: OrderStates;
    OrderDateFrom: Date;
    OrderDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface OrderSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: OrderDto[];
}
