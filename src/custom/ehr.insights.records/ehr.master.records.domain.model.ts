import { uuid } from "../../domain.types/miscellaneous/system.types";
import { DataTypes, EHRRecordTypes } from "./ehr.record.types";

export interface EHRMasterRecordsDomainModel {
    PatientUserId?: uuid;
    Type          : EHRRecordTypes;
    Name          : string;

    PrimaryValueInt?     : number;
    PrimaryValueFloat?   : number;
    PrimaryValueString?  : string;
    PrimaryValueBoolean? : boolean;
    PrimaryValueDataType?: DataTypes;
    PrimaryValueName?    : string;
    PrimaryValueUnit?    : string;

    SecondaryValueInt?     : number;
    SecondaryValueFloat?   : number;
    SecondaryValueString?  : string;
    SecondaryValueBoolean? : boolean;
    SecondaryValueDataType?: DataTypes;
    SecondaryValueName?    : string;
    SecondaryValueUnit?    : string;

    TimeStamp? : Date;
    RecordDate?: string;
}
