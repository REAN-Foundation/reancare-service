import { BaseSearchResults, BaseSearchFilters } from "../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { OrderDto } from "./order.dto";
import { OrderStates } from "./order.types";

//////////////////////////////////////////////////////////////////////

export interface OrderSearchFilters extends BaseSearchFilters{
    Type?                     : string;
    PatientUserId?            : uuid;
    MedicalPractitionerUserId?: uuid;
    VisitId?                  : uuid;
    ReferenceOrderId?         : uuid;
    FulfilledByUserId?        : uuid;
    FulfilledByOrganizationId?: uuid;
    CurrentState?             : OrderStates;
    OrderDateFrom             : Date;
    OrderDateTo               : Date;
}

export interface OrderSearchResults extends BaseSearchResults{
    Items: OrderDto[];
}
