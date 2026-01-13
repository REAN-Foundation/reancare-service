import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { uuid } from "../../../miscellaneous/system.types";
import { DeliveryDto } from "./delivery.dto";

//////////////////////////////////////////////////////////////////////

export interface DeliverySearchFilters extends BaseSearchFilters {
    PatientUserId?        : uuid;
    PregnancyId?          : uuid;
    DeliveryDate?         : Date;
    DeliveryTime?         : string;
    GestationAtBirth?     : number;
    DeliveryMode?         : string;
    DeliveryPlace?        : string;
    DeliveryOutcome?      : string;
    DateOfDischarge?      : Date;
    OverallDiagnosis?     : string;
}

export interface DeliverySearchResults extends BaseSearchResults {
    Items: DeliveryDto[];
}
