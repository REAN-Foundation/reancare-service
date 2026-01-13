import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { ComplicationDto } from "./complication.dto";

export interface ComplicationSearchFilter {
    id?                  : uuid;
    DeliveryId?          : uuid;
    BabyId1?             : uuid;
    BabyId2?             : uuid;
    BabyId3?             : uuid;
    Name?                : string;
    Status?              : string;
    Severity?            : string;
    MedicalConditionId?  : uuid;
}

export interface ComplicationSearchResults {
    Items     : ComplicationDto[];
}
