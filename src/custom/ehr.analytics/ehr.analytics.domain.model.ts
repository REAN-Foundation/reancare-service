import { Gender, uuid } from "../../domain.types/miscellaneous/system.types";
import { DataTypes, EHRRecordTypes } from "./ehr.record.types";

export interface EHRDynamicRecordDomainModel {
    PatientUserId?: uuid;
    RecordId?     : uuid;
    Type          : EHRRecordTypes;
    Name          : string;

    ValueInt?     : number;
    ValueFloat?   : number;
    ValueString?  : string;
    ValueBoolean? : boolean;
    ValueDate?    : Date;
    ValueDataType?: DataTypes;
    ValueName?    : string;
    ValueUnit?    : string;

    TimeStamp? : Date;
    RecordDate?: string;
}

export interface EHRStaticRecordDomainModel {
    DoctorPersonId?     : uuid;
    OtherDoctorPersonId?: uuid;
    ProviderCode?       : string;
    HealthSystem?       : string;
    AssociatedHospital? : string;
    Gender?             : Gender;
    BirthDate?          : Date;
    Age?                : string;
    BodyHeight?         : number;
    Ethnicity?          : string;
    Race?               : string;
    Nationality?        : string;
    HasHeartAilment?    : boolean;
    IsDiabetic?         : boolean;
    MaritalStatus?      : string;
    BloodGroup?         : string;
    MajorAilment?       : string;
    IsSmoker?           : boolean;
    Location?           : string;
}
