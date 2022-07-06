import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface BloodCholesterolDto {
    id?                : uuid;
    EhrId?             : uuid;
    PatientUserId?     : uuid;
    TotalCholesterol?  : number;
    HDL                : number;
    LDL                : number;
    TriglycerideLevel? : number;
    Ratio?             : number;
    Unit               : string;
    RecordDate?        : Date;
    RecordedByUserId?  : uuid;
}
