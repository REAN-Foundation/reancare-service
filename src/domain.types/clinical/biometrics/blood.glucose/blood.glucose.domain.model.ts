import { uuid } from "../../../../domain.types/miscellaneous/system.types";
export interface BloodGlucoseDomainModel {
    id?               : uuid;
    EhrId?            : uuid;
    PatientUserId?    : uuid;
    BloodGlucose      : number;
    Unit              : string;
    RecordDate?       : Date;
    RecordedByUserId? : uuid;
    RecordedByEhrId?  : uuid;
}
