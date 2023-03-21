import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface WaterConsumptionDomainModel {
    id?             : uuid,
    EhrId?          : string;
    PatientUserId?  : uuid;
    TerraSummaryId? : string;
    Provider?       : string;
    Volume          : number;
    Time?           : Date;
}
