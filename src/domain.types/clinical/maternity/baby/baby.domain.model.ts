import { uuid } from "../../../miscellaneous/system.types";

export interface BabyDomainModel {
    id?                 : uuid;
    DeliveryId          : uuid;
    PatientUserId?      : uuid;
    WeightAtBirthGrams  : number;
    Gender              : string;
    Status              : string;
    ComplicationId?     : uuid;
}
