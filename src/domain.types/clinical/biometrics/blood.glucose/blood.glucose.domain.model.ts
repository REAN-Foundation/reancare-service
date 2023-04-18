import { uuid } from "../../../../domain.types/miscellaneous/system.types";
export interface BloodGlucoseDomainModel {
    id?               : uuid;
    EhrId?            : uuid;
    PatientUserId?    : uuid;
    TerraSummaryId?   : string;
    Provider?         : string;
    BloodGlucose      : number;
    Unit              : string;
    RecordDate?       : Date;
    RecordedByUserId? : uuid;
    RecordedByEhrId?  : uuid;
}
