import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { uuid } from "../../../miscellaneous/system.types";
import { PostnatalVisitDto } from "./postnatal.visit.dto";

//////////////////////////////////////////////////////////////////////

export interface PostnatalVisitSearchFilters extends BaseSearchFilters {
    DeliveryId?         : uuid;
    PatientUserId?      : uuid;
    DateOfVisit?        : Date;
    BodyWeightId?       : uuid;
    ComplicationId?     : uuid;
    BodyTemperatureId?  : uuid;
    BloodPressureId?    : uuid;
}

export interface PostnatalVisitSearchResults extends BaseSearchResults {
    Items: PostnatalVisitDto[];
}
