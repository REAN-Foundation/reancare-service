import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface BloodOxygenSaturationDomainModel {
    id?                  : uuid;
    EhrId?               : string;
    PatientUserId        : uuid;
    BloodOxygenSaturation: number;
    Unit                 : string;
    RecordDate?          : Date;
    RecordedByUserId?    : uuid;
}
