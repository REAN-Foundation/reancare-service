import { Gender, uuid } from "../../domain.types/miscellaneous/system.types";
import { DataTypes, EHRRecordTypes } from "./ehr.record.types";

export interface EHRMedicationDomainModel {
    AppName?          : string;
    PatientUserId?    : uuid;
    RecordId?         : uuid;
    DrugName?         : string;
    DrugId?           : string;
    Dose?             : string;
    Details?          : string;
    TimeScheduleStart?: Date;
    TimeScheduleEnd?  : Date;
    IsTaken?          : boolean;
    TakenAt?          : Date;
    IsMissed?         : boolean;
    IsCancelled?      : boolean;
    RecordDate?       : Date;
    TimeStamp?        : Date;
    AdditionalInfo?   : string;
}
