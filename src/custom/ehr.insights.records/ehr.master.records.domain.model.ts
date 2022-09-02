import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EHRRecordTypes } from "./ehr.record.types";

export interface EHRMasterRecordsDomainModel {
    PatientUserId?: uuid;
    ProviderId?   : string;
    Type          : EHRRecordTypes;
    Name          : string;

    PrimaryValueInt?     : number;
    PrimaryValueFloat?   : number;
    PrimaryValueString?  : string;
    PrimaryValueDataType?: string;
    PrimaryValueName?    : string;
    PrimaryValueUnit?    : string;

    SecondaryValueInt?     : number;
    SecondaryValueFloat?   : number;
    SecondaryValueString?  : string;
    SecondaryValueDataType?: string;
    SecondaryValueName?    : string;
    SecondaryValueUnit?    : string;

    TimeStamp? : Date;
    RecordDate?: string;
}
